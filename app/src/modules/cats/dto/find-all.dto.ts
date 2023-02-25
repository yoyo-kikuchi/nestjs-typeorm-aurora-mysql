import { ApiProperty } from '@nestjs/swagger';

export class FindAllDto {
  @ApiProperty({ description: 'name of your pet', example: '001' })
  readonly code: string;
}
