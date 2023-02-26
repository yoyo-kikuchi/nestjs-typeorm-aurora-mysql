import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import * as Modules from 'src/modules';

const modules = Object.values(Modules);

@Module({
  imports: [...modules, ConfigModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
