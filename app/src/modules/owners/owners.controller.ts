import { Controller, Get, Post, Query, Inject } from '@nestjs/common';
import { FindAllDto } from './dto/find-all.dto';
import { FindAllEntity } from './entities/find-all.entity';
import { DATASTORE } from 'src/interface';
import { MPetType } from 'src/modules/models';

import { Database } from 'src/interface';

@Controller('owners')
export class OwnersController {
  constructor(
    @Inject(DATASTORE)
    private readonly _database: Database,
  ) {}

  @Get()
  async findAll(@Query() query: FindAllDto): Promise<FindAllEntity> {
    const res = await this._database.findOne<MPetType>(MPetType, {
      where: {
        code: query.code,
      },
    });
    return {
      id: res.id,
      code: res.code,
      value: res.value,
    };
  }

  @Post()
  async create(): Promise<void> {
    await this._database.insert<MPetType>(MPetType, {
      code: '004',
      value: '虎',
    });
    return;
  }
}
