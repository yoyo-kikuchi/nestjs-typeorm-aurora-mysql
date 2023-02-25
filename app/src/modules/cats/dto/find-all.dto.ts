import { ApiProperty } from '@nestjs/swagger';

export class FindAllDto {
  @ApiProperty({ description: 'name of your pet', example: 'momo' })
  readonly catName: string;
}
