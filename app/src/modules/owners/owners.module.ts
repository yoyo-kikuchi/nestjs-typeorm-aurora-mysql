import { Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { LoggerModule } from 'src/logger';
import { TypeormService, TypeormModule } from 'src/lib/typeorm';
import { DATASTORE } from 'src/interface';

@Module({
  imports: [LoggerModule, TypeormModule],
  controllers: [OwnersController],
  providers: [
    {
      provide: DATASTORE,
      useExisting: TypeormService,
    },
  ],
  exports: [],
})
export class OwnersModule {}
