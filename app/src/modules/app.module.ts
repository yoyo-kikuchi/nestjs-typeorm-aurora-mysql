import { Module } from '@nestjs/common';
import { TypeormService } from 'src/lib/typeorm';
import { DATASTORE } from 'src/interface';
import { LoggerModule } from 'src/logger';
import { OwnersController } from './owners/owners.controller';
import { PetsController } from './pets/pets.controller';

@Module({
  imports: [LoggerModule],
  controllers: [OwnersController, PetsController],
  providers: [
    {
      provide: DATASTORE,
      useClass: TypeormService,
    },
  ],
})
export class AppModule {}
