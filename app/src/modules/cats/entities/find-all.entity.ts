import { ApiProperty } from '@nestjs/swagger';

export class FindAllEntity {
  @ApiProperty({
    example: 1,
  })
  public id: number;

  @ApiProperty({
    example: '001',
  })
  public code: string;

  @ApiProperty({
    example: '猫',
  })
  public value: string;
}
