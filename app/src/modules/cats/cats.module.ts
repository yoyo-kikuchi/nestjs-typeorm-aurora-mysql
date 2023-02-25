import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { TypeormService } from 'src/lib/typeorm/typeorm.service';
import { DATASTORE } from 'src/interface';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [
    {
      provide: DATASTORE,
      useClass: TypeormService,
    },
  ],
})
export class CatsModule {}
