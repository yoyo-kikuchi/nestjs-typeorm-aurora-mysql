import type {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  InsertResult,
  FindOptionsWhere,
  UpdateResult,
  DeleteResult,
  ObjectLiteral,
  FindManyOptions,
} from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export { In } from 'typeorm';
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
  FindManyOptions,
};
export type QueryParams = string | number | any[];
export type NamedQueryParams = { [key: string]: any };

export const DATASTORE = 'datastore';

export interface Database {
  close(): Promise<void>;
  find<T>(model: EntityTarget<T>, options?: FindManyOptions): Promise<T[]>;
  findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | null>;
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
  query<T = any>(query: string, parameters?: QueryParams[]): Promise<T>;
  namedQuery<T = any>(query: string, parameters?: NamedQueryParams): Promise<T>;
  transact(callback: (tx: EntityManager) => Promise<void>): Promise<void>;
}
