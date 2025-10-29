import { IsString, IsNotEmpty, IsOptional, IsArray, IsIn, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID de la orden a la que pertenece el mensaje (chat ligado a esa orden)',
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
    example: 'Hola, necesito ayuda con mi pedido',
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
}
