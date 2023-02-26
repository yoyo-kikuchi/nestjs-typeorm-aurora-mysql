import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { LoggerModule } from 'src/logger';
import { TypeOrmService, TypeOrmModule } from 'src/lib/typeorm';
import { DATASTORE } from 'src/interface';

@Module({
  imports: [LoggerModule, TypeOrmModule],
  controllers: [PetsController],
  providers: [
    PetsService,
    {
      provide: DATASTORE,
      useExisting: TypeOrmService,
    },
  ],
})
export class PetsModule {}
