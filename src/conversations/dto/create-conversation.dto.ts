import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 102 })
  @IsInt()
  @Min(1)
  sellerId: number;
}
