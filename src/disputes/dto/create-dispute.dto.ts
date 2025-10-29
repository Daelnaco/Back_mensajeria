// src/disputes/dto/create-dispute.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDisputeDto {
  @ApiProperty({
    description: 'ID de la orden asociada a la disputa',
    example: 'ORD-12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderId?: string; // puede ser string, si en tu DTO lo tenías como number cámbialo aquí y abajo en service

  @ApiProperty({
    description: 'Motivo de la disputa',
    example: 'Producto dañado',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Descripción detallada',
    example: 'El producto llegó roto y no enciende.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Adjuntos opcionales (URLs)',
    example: ['https://ruta/foto1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
