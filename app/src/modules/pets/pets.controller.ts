import { Controller, Get, Post, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { FindAllDto } from './dto/find-all.dto';
import { FindAllEntity } from './entities/find-all.entity';

@Controller('cats')
export class PetsController {
  constructor(private readonly _petsService: PetsService) {}

  @Get()
  async findAll(@Query() query: FindAllDto): Promise<FindAllEntity> {
    return await this._petsService.findAll(query.code).catch((err) => {
      throw err;
    });
  }

  @Post()
  async create(): Promise<void> {
    return await this._petsService.create().catch((err) => {
      throw err;
    });
  }
}
