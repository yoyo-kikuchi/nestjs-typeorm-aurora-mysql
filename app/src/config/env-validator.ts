import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
} from 'class-validator';
import { plainToClass, Type } from 'class-transformer';

export class EnvValidator {
  @IsNotEmpty()
  @IsString()
  WRITE_DB_HOST: string;

  @IsNotEmpty()
  @IsString()
  WRITE_DB_USER: string;

  @IsNotEmpty()
  @IsString()
  WRITE_DB_PASSWORD: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  WRITE_DB_PORT = 3306;

  @IsNotEmpty()
  @IsString()
  READ_DB_HOST: string;

  @IsNotEmpty()
  @IsString()
  READ_DB_USER: string;

  @IsNotEmpty()
  @IsString()
  READ_DB_PASSWORD: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  READ_DB_PORT = 3306;

  @IsNotEmpty()
  @IsString()
  DB_SCHEMA: string;

  @IsOptional()
  @IsString()
  DB_DEBUG = 'false';

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  DB_CONNECTION_LIFECYCLE_TIME = 5000;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvValidator, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
