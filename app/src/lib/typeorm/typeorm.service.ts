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

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable()
export class TypeOrmService implements Database, OnModuleInit {
  private _writeDataSource: DataSource;
  private _readDataSourceMain: DataSource;
  private _readDataSourceSub: DataSource;
  private _isAwaitDestroy = false;
  private _isDataSourceMainActive = true;
  private readonly _graceTime: number;
  private readonly _lifecycleTime: number;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _loggerService: LoggerService,
  ) {
    this._graceTime = 10000;
    this._lifecycleTime =
      this._configService.databaseConnectionLifecycle || 30000;
    this._writeDataSource = this.writeDataSource;
    this._readDataSourceMain = this.readDataSource;
    this._readDataSourceSub = this.readDataSource;
  }

  private get writeDataSource(): DataSource {
    return new DataSource({
      type: 'mysql',
      host: this._configService.writeDatabaseHost,
      port: this._configService.writeDatabasePort,
      username: this._configService.writeDatabaseUser,
      password: this._configService.writeDatabasePass,
      database: this._configService.databaseSchema,
      entities: [...entities],
      synchronize: false,
      logging: this._configService.databaseLogging,
    });
  }

  private get readDataSource(): DataSource {
    return new DataSource({
      type: 'mysql',
      host: this._configService.readDatabaseHost,
      port: this._configService.readDatabasePort,
      username: this._configService.readDatabaseUser,
      password: this._configService.readDatabasePass,
      database: this._configService.databaseSchema,
      entities: [...entities],
      synchronize: false,
      logging: this._configService.databaseLogging,
    });
  }

  private get connection(): DataSource {
    if (this._isDataSourceMainActive) {
      this._loggerService.info('use dataSourceMain');
      return this._readDataSourceMain;
    } else {
      this._loggerService.info('use dataSourceSub');
      return this._readDataSourceSub;
    }
  }

  // 初期疎通確認
  public async onModuleInit(): Promise<void> {
    this._loggerService.info('TypeormService onModuleInit!!');
    // connection pool reset
    await this._writeDataSource.initialize();
    await this._readDataSourceMain.initialize();
    setInterval(async () => {
      if (this._isAwaitDestroy) return;
      await this.initializeConnection().catch((err) => {
        this._loggerService.warn(err);
      });
      setTimeout(async () => {
        await this.destroyConnection().catch((err) => {
          this._loggerService.warn(err);
        });
      }, this._graceTime);
    }, this._lifecycleTime);
  }

  private async initializeConnection(): Promise<void> {
    if (this._isDataSourceMainActive) {
      await this._readDataSourceSub.initialize().catch((err) => {
        throw new Error(`cannot reconnect sub dataSource err: ${err}`);
      });
      this._loggerService.info('dataSourceSub reconnected connection pool');
      this._isDataSourceMainActive = false;
    } else {
      await this._readDataSourceMain.initialize().catch((err) => {
        throw new Error(`cannot reconnect main dataSource err: ${err}`);
      });
      this._loggerService.info('dataSourceMain reconnected connection pool');
      this._isDataSourceMainActive = true;
    }
    this._loggerService.info('connection end');
  }

  /**
   * MainDataSourceがアクティブな場合はSubDataSourceをcloseする
   */
  private async destroyConnection(): Promise<void> {
    this._isAwaitDestroy = true;
    if (this._isDataSourceMainActive) {
      this._loggerService.info('destroyConnection 31');
      await this._readDataSourceSub.destroy().catch((err) => {
        throw new Error(`cannot close sub dataSource err: ${err}`);
      });
      this._loggerService.info('dataSourceSub reseated connection pool');
    } else {
      await this._readDataSourceMain.destroy().catch((err) => {
        throw new Error(`cannot close main dataSource err: ${err}`);
      });
      this._loggerService.info('dataSourceMain reseated connection pool');
    }
    this._isAwaitDestroy = false;
  }

  public async initialize(): Promise<void> {
    await this._writeDataSource.initialize();
    await this._readDataSourceMain.initialize();
  }

  public async close(): Promise<void> {
    await this._writeDataSource.destroy();
    await this.connection.destroy();
  }

  public async find<T>(
    model: EntityTarget<T>,
    options?: FindManyOptions,
  ): Promise<T[]> {
    const repository = this.connection.getRepository(model);
    await sleep(10000);
    return await repository.find(options).catch((err) => {
      throw new Error(err);
    });
  }

  public async findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | null> {
    const repository = this.connection.getRepository(model);
    return await repository.findOne(options).catch((err) => {
      throw new Error(err);
    });
  }

  public async insert<T>(
    model: EntityTarget<T>,
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    const repository = this._writeDataSource.getRepository<T>(model);
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
    const repository = this._writeDataSource.getRepository<T>(model);
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
    const repository = this._writeDataSource.getRepository<T>(model);
    return await repository.update(riteria, artialEntity).catch((err) => {
      throw err;
    });
  }

  public async query<T = any>(
    query: string,
    parameters?: QueryParams[],
  ): Promise<T> {
    const slaveQueryRunner = this.connection.createQueryRunner('slave');
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
    return await this.connection.query(query, parameters).catch((err) => {
      throw err;
    });
  }

  // In case in (:...param)
  public async namedQuery<T = any>(
    query: string,
    parameters?: NamedQueryParams,
  ): Promise<T> {
    const slaveQueryRunner = this.connection.createQueryRunner('slave');

    const [q, bindValues] = this.named(query, parameters);
    try {
      return await slaveQueryRunner.query(q, bindValues);
    } catch (err) {
      throw err;
    } finally {
      await slaveQueryRunner.release().catch((err) => {
        throw err;
      });
    }
  }

  public async transact(
    callback: (tx: EntityManager) => Promise<any>,
  ): Promise<void> {
    const queryRunner = this._writeDataSource.createQueryRunner();
    await queryRunner.connect().catch((err) => {
      throw err;
    });
    await queryRunner.startTransaction().catch((err) => {
      throw err;
    });
    return await callback(queryRunner.manager)
      .then(async () => {
        await queryRunner.commitTransaction();
      })
      .catch(async (err) => {
        await queryRunner.rollbackTransaction();
        throw err;
      })
      .finally(async () => {
        await queryRunner.release();
      });
  }

  private named(query: string, parameters?: ObjectLiteral): [string, any[]] {
    let prams: ObjectLiteral = {};
    if (typeof parameters !== 'undefined') {
      prams = parameters;
    }
    const entityManage = this.connection.createEntityManager();
    const [q, bindValues] =
      entityManage.connection.driver.escapeQueryWithParameters(
        query,
        prams,
        {},
      );
    return [q, bindValues];
  }
}
