import { Module } from '@nestjs/common';
import { OwnersController } from './owners.controller';
import { LoggerModule } from 'src/logger';
import { TypeOrmService, TypeOrmModule } from 'src/lib/typeorm';
import { DATASTORE } from 'src/interface';

@Module({
  imports: [LoggerModule, TypeOrmModule],
  controllers: [OwnersController],
  providers: [
    {
      provide: DATASTORE,
      useExisting: TypeOrmService,
    },
  ],
  exports: [],
})
export class OwnersModule {}
