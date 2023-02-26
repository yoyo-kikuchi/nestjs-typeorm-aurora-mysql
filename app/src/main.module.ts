import { Module } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [AppModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
