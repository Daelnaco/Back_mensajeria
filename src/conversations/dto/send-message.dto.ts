import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class SendConversationMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  text!: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @IsUrl({}, { each: true })
  attachments?: string[];
}
