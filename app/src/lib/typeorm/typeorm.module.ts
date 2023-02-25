import { Module } from '@nestjs/common';
import { TypeormService } from './typeorm.service';

@Module({
  providers: [TypeormService],
  imports: [],
  exports: [TypeormService],
})
export class TypeormModule {}
