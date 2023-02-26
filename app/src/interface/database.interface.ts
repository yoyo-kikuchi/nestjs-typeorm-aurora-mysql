import type {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  InsertResult,
  FindOptionsWhere,
  UpdateResult,
  DeleteResult,
  ObjectLiteral,
  In,
} from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type { In };
export type { QueryDeepPartialEntity };
export type {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  UpdateResult,
  DeleteResult,
  ObjectLiteral,
};
export type QueryParams = string | number | any[];
export type NamedQueryParams = { [key: string]: any };

export const DATASTORE = 'datastore';

export interface Database {
  close(): Promise<void>;
  findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | undefined>;
  insert<T>(
    model: EntityTarget<T>,
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult>;
  update<T>(
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
  ): Promise<UpdateResult>;
  delete<T>(
    model: EntityTarget<T>,
    riteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
  ): Promise<DeleteResult>;
  select<T = any>(query: string, parameters?: QueryParams[]): Promise<T[]>;
  namedSelect<T = any>(
    query: string,
    parameters?: NamedQueryParams,
  ): Promise<T[]>;
  exec(query: string, parameters?: QueryParams[]): Promise<void>;
  transact(callback: (tx: EntityManager) => Promise<void>): Promise<void>;
}
