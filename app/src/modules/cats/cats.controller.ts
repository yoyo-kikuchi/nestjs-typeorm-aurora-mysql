import { Controller, Get, Query, Inject } from '@nestjs/common';
import { FindAllDto } from './dto/find-all.dto';
import { DATASTORE } from 'src/interface';
import { MPetType } from 'src/lib/typeorm/models';

import { Database } from 'src/interface';

@Controller('cats')
export class CatsController {
  constructor(
    @Inject(DATASTORE)
    private readonly _database: Database,
  ) {}

  @Get()
  async findAll(@Query() query: FindAllDto): Promise<string> {
    const res = await this._database.findOne<MPetType>(MPetType, {
      where: {
        id: 1,
      },
    });
    console.log(res);

    return `cat name is ${query.catName} !!`;
  }
}
