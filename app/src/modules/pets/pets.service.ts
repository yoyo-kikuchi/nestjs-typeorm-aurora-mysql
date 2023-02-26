import { Injectable, Inject } from '@nestjs/common';
import { DATASTORE } from 'src/interface';
import { FindAllEntity } from './entities/find-all.entity';
import { MPetType } from 'src/modules/models';

import type { Database } from 'src/interface';

@Injectable()
export class PetsService {
  constructor(
    @Inject(DATASTORE)
    private readonly _database: Database,
  ) {}

  public async findAll(code: string): Promise<FindAllEntity> {
    const res = await this._database.findOne<MPetType>(MPetType, {
      where: {
        code: code,
      },
    });
    return {
      id: res.id,
      code: res.code,
      value: res.value,
    };
  }

  public async create(): Promise<void> {
    await this._database.insert<MPetType>(MPetType, {
      code: '004',
      value: '虎',
    });
    return;
  }
}
