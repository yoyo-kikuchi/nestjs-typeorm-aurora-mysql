import { Module } from '@nestjs/common';
import * as Modules from './modules';
import { ConfigModule } from 'src/config/config.module';

const modules = Object.values(Modules);

@Module({
  imports: [...modules, ConfigModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
