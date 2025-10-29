import { IsString, IsNotEmpty, IsOptional, IsArray, IsIn, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConversationCreateMessageDto {
  @ApiProperty({
    description: 'ID de la orden asociada a la conversación',
    example: 'ORD-12345',
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Tipo de mensaje',
    example: 'text',
    enum: ['text', 'image'],
  })
  @IsString()
  @IsIn(['text', 'image'])
  type: 'text' | 'image';

  @ApiProperty({
    description:
      'Contenido del mensaje si es de tipo texto, o caption si es imagen',
    example: 'Hola, ¿puedes confirmar el estado del envío?',
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description: 'Adjuntos (URLs de imágenes u otros archivos)',
    example: ['https://uploads.example.com/evidencia1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiProperty({
    description:
      'ID del otro participante en la conversación (por ejemplo vendedor si yo soy comprador)',
    example: 'USER456',
  })
  @IsString()
  @IsNotEmpty()
  otherUserId: string;
}
