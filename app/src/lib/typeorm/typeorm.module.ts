import { Module } from '@nestjs/common';
import { TypeOrmService } from './typeorm.service';
import { LoggerModule } from 'src/logger';

@Module({
  providers: [TypeOrmService],
  imports: [LoggerModule],
  exports: [TypeOrmService],
})
export class TypeOrmModule {}
