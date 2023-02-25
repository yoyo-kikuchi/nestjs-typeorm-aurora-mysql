import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { DataSource } from 'typeorm';
import * as Entities from './models';

import type { Database } from 'src/interface';

const entities = Object.values(Entities);

import type {
  FindOneOptions,
  EntityTarget,
  InsertResult,
  UpdateResult,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type NamedQueryParams = { [key: string]: any };

@Injectable()
export class TypeormService implements Database {
  private readonly _dataSource: DataSource;

  constructor(private _configService: ConfigService) {
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

  // private async connect<T>(
  //   callback: (ds: DataSource) => Promise<T | undefined>,
  // ): Promise<T> {
  //   await this._dataSource.initialize();
  //   const res = await callback(this._dataSource).catch((err) => {
  //     throw new Error(err);
  //   });
  //   await this._dataSource.destroy();
  //   return res;
  // }

  public async close(): Promise<void> {
    await this._dataSource.destroy();
  }

  public async findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | undefined> {
    await this._dataSource.initialize();
    const repository = this._dataSource.getRepository(model);
    const data = await repository.findOne(options).catch((err) => {
      throw new Error(err);
    });
    await this._dataSource.destroy();
    return data;
    // return this.connect<T | undefined>(async (ds: DataSource) => {
    //   const repository = ds.getRepository(model);
    //   const data = await repository.findOne(options).catch((err) => {
    //     throw new Error(err);
    //   });
    //   return data;
    // }).catch((err) => {
    //   throw err;
    // });
  }

  public async insert<T>(
    model: EntityTarget<T>,
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    const repository = this._dataSource.getRepository<T>(model);
    const res = await repository.insert(entity).catch((err) => {
      throw new Error(err);
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
      throw new Error(err);
    });
    return data;
  }

  public async select<T = any>(
    query: string,
    parameters?: any[],
  ): Promise<T[]> {
    await this._dataSource.initialize();
    const res = await this._dataSource.query(query, parameters).catch((err) => {
      throw new Error(err);
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
      throw new Error(err);
    });
    return res;
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
