import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { LoggerModule } from 'src/logger';
import { TypeormService, TypeormModule } from 'src/lib/typeorm';
import { DATASTORE } from 'src/interface';

@Module({
  imports: [LoggerModule, TypeormModule],
  controllers: [PetsController],
  providers: [
    PetsService,
    {
      provide: DATASTORE,
      useExisting: TypeormService,
    },
  ],
})
export class PetsModule {}
