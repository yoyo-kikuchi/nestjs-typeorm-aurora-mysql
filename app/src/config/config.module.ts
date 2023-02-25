import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env-validator';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true, validate })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
