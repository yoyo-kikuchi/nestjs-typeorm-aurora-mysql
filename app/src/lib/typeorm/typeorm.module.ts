import { Module } from '@nestjs/common';
import { TypeormService } from './typeorm.service';
import { LoggerModule } from 'src/logger';

@Module({
  providers: [TypeormService],
  imports: [LoggerModule],
  exports: [TypeormService],
})
export class TypeormModule {}
