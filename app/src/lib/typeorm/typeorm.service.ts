import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { DataSource } from 'typeorm';
import { LoggerService } from 'src/logger';
import * as Entities from 'src/modules/models';

import type {
  Database,
  EntityManager,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  UpdateResult,
  DeleteResult,
  QueryParams,
  ObjectLiteral,
  NamedQueryParams,
  QueryDeepPartialEntity,
} from 'src/interface';

const entities = Object.values(Entities);

@Injectable()
export class TypeormService implements Database, OnModuleInit {
  private readonly _dataSource: DataSource;
  private readonly _lifecycleTime: number;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _loggerService: LoggerService,
  ) {
    this._lifecycleTime =
      this._configService.databaseConnectionLifecycle || 30000;

    this._dataSource = new DataSource({
      type: 'mysql',
      replication: {
        master: {
          host: this._configService.writeDatabaseHost,
          port: this._configService.writeDatabasePort,
          username: this._configService.writeDatabaseUser,
          password: this._configService.writeDatabasePass,
          database: this._configService.databaseSchema,
        },
        slaves: [
          {
            host: this._configService.readDatabaseHost,
            port: this._configService.readDatabasePort,
            username: this._configService.readDatabaseUser,
            password: this._configService.readDatabasePass,
            database: this._configService.databaseSchema,
          },
        ],
      },
      entities: [...entities],
      synchronize: false,
      logging: this._configService.databaseLogging,
    });
  }

  // 初期疎通確認
  public async onModuleInit(): Promise<void> {
    console.log('onModuleInit!!');

    await this._dataSource.initialize();
    // connection pool reset
    setInterval(async () => {
      await this._dataSource.destroy();
      this._loggerService.debug('reseated connection pool');

      await this._dataSource.initialize();
      this._loggerService.debug('reconnected connection pool');
    }, this._lifecycleTime);
  }

  public async close(): Promise<void> {
    await this._dataSource.destroy();
  }

  public async findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | undefined> {
    const repository = this._dataSource.getRepository(model);
    const data = await repository.findOne(options).catch((err) => {
      throw new Error(err);
    });
    return data;
  }

  public async insert<T>(
    model: EntityTarget<T>,
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    const repository = this._dataSource.getRepository<T>(model);
    const res = await repository.insert(entity).catch((err) => {
      throw err;
    });
    return res;
  }

  public async delete<T>(
    model: EntityTarget<T>,
    riteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
  ): Promise<DeleteResult> {
    const repository = this._dataSource.getRepository<T>(model);
    const res = await repository.delete(riteria).catch((err) => {
      throw err;
    });
    return res;
  }

  public async update<T>(
    model: EntityTarget<T>,
    riteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
    artialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    const repository = this._dataSource.getRepository<T>(model);
    const data = await repository.update(riteria, artialEntity).catch((err) => {
      throw err;
    });
    return data;
  }

  public async select<T = any>(
    query: string,
    parameters?: QueryParams[],
  ): Promise<T[]> {
    await this._dataSource.initialize();
    const res = await this._dataSource.query(query, parameters).catch((err) => {
      throw err;
    });
    await this._dataSource.destroy();
    return res;
  }

  // In case in (:...param)
  public async namedSelect<T = any>(
    query: string,
    parameters?: NamedQueryParams,
  ): Promise<T[]> {
    const [q, bindValues] = this.named(query, parameters);

    const res = await this._dataSource.query(q, bindValues).catch((err) => {
      throw err;
    });
    return res;
  }

  public async exec(query: string, parameters?: QueryParams[]): Promise<void> {
    await this._dataSource.query(query, parameters).catch((err) => {
      throw err;
    });
    return;
  }

  public async transact(
    callback: (tx: EntityManager) => Promise<void>,
  ): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect().catch((err) => {
      throw err;
    });

    await queryRunner.startTransaction().catch((err) => {
      throw err;
    });

    try {
      await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return;
  }

  private named(query: string, parameters?: ObjectLiteral): [string, any[]] {
    let prams: ObjectLiteral = {};
    if (typeof parameters !== 'undefined') {
      prams = parameters;
    }
    const entityManage = this._dataSource.createEntityManager();
    const [q, bindValues] =
      entityManage.connection.driver.escapeQueryWithParameters(
        query,
        prams,
        {},
      );
    return [q, bindValues];
  }
}
