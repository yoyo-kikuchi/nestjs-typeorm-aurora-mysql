import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private _configService: NestConfigService) {}

  get writeDatabaseHost(): string {
    return this._configService.get('WRITE_DB_HOST');
  }

  get writeDatabaseUser(): string {
    return this._configService.get('WRITE_DB_USER');
  }

  get writeDatabasePass(): string {
    return this._configService.get('WRITE_DB_PASSWORD');
  }

  get writeDatabasePort(): number {
    return this._configService.get('WRITE_DB_PORT');
  }

  get readDatabaseHost(): string {
    return this._configService.get('READ_DB_HOST');
  }

  get readDatabaseUser(): string {
    return this._configService.get('READ_DB_USER');
  }

  get readDatabasePass(): string {
    return this._configService.get('READ_DB_PASSWORD');
  }

  get readDatabasePort(): number {
    return this._configService.get('READ_DB_PORT');
  }

  get databaseSchema(): string {
    return this._configService.get('DB_SCHEMA');
  }

  get databaseLogging(): boolean {
    const val = this._configService.get('DB_DEBUG');
    if (val === 'false') {
      return false;
    }
    return true;
  }
}
