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
  FindManyOptions,
} from 'src/interface';

const entities = Object.values(Entities);

@Injectable()
export class TypeOrmService implements Database, OnModuleInit {
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
        selector: 'RR', //(Round-Robin).
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
    this._loggerService.info('TypeormService onModuleInit!!');

    await this._dataSource.initialize();
    // connection pool reset
    setInterval(async () => {
      await this._dataSource.destroy();
      this._loggerService.debug('reseated connection pool');

      await this._dataSource.initialize();
      this._loggerService.debug('reconnected connection pool');
    }, this._lifecycleTime);
  }

  public async initialize(): Promise<void> {
    await this._dataSource.initialize();
  }

  public async close(): Promise<void> {
    await this._dataSource.destroy();
  }

  public async find<T>(
    model: EntityTarget<T>,
    options?: FindManyOptions,
  ): Promise<T[]> {
    const repository = this._dataSource.getRepository(model);
    return await repository.find(options).catch((err) => {
      throw new Error(err);
    });
  }

  public async findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | null> {
    const repository = this._dataSource.getRepository(model);
    return await repository.findOne(options).catch((err) => {
      throw new Error(err);
    });
  }

  public async insert<T>(
    model: EntityTarget<T>,
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    const repository = this._dataSource.getRepository<T>(model);
    return await repository.insert(entity).catch((err) => {
      throw err;
    });
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
    return await repository.delete(riteria).catch((err) => {
      throw err;
    });
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
    return await repository.update(riteria, artialEntity).catch((err) => {
      throw err;
    });
  }

  public async query<T = any>(
    query: string,
    parameters?: QueryParams[],
  ): Promise<T> {
    const slaveQueryRunner = this._dataSource.createQueryRunner('slave');
    try {
      return await slaveQueryRunner.query(query, parameters);
    } catch (err) {
      throw err;
    } finally {
      slaveQueryRunner.release();
    }
  }

  public async exec<T = any>(
    query: string,
    parameters?: QueryParams[],
  ): Promise<T> {
    return await this._dataSource.query(query, parameters).catch((err) => {
      throw err;
    });
  }

  // In case in (:...param)
  public async namedQuery<T = any>(
    query: string,
    parameters?: NamedQueryParams,
  ): Promise<T> {
    const slaveQueryRunner = this._dataSource.createQueryRunner('slave');

    const [q, bindValues] = this.named(query, parameters);
    try {
      return await slaveQueryRunner.query(q, bindValues);
    } catch (err) {
      throw err;
    } finally {
      slaveQueryRunner.release();
    }
  }

  public async transact(
    callback: (tx: EntityManager) => Promise<any>,
  ): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect().catch((err) => {
      throw err;
    });

    await queryRunner.startTransaction().catch((err) => {
      throw err;
    });

    let result: any = undefined;
    try {
      result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    return result;
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
