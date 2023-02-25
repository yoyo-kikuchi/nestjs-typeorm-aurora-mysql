import type { EntityManager, EntityTarget, FindOneOptions } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export { In } from 'typeorm';
export { QueryDeepPartialEntity };
export type QueryParams = string | number | any[];
export type NamedQueryParams = { [key: string]: any };
export {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  InsertResult,
  UpdateResult,
  DeleteResult,
} from 'typeorm';

export type CustomEntityManager = EntityManager;

export const DATASTORE = 'datastore';

export interface Database {
  close(): Promise<void>;
  findOne<T>(
    model: EntityTarget<T>,
    options?: FindOneOptions,
  ): Promise<T | undefined>;
}
