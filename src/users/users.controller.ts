import { Controller, Get, Post, Body, Param, Patch, Delete, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';

@ApiTags('Users (Squad 4 - Auth y Perfiles)')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear usuario (Squad 4)',
    description:
      'Crea un usuario y su perfil/rol. ' +
      'Este módulo pertenece al Squad 4 (Auth y Perfiles). ' +
      'Los demás squads consumen estos usuarios como participantes válidos de disputas y conversaciones.',
  })
  @ApiCreatedResponse({ description: 'Usuario creado correctamente.' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios (Squad 4)',
    description:
      'Lista todos los usuarios registrados. ' +
      'Esta información se usa a nivel de otros módulos para auditar actores en las disputas, mensajes, etc. ' +
      'Implementación y mantenimiento: Squad 4.',
  })
  @ApiOkResponse({ description: 'Lista de usuarios.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener datos de usuario por ID',
    description:
      'Devuelve los datos de un usuario específico. ' +
      'Esto cumple la necesidad de integración: "Equipo 9 requiere: datos de usuario por id". ' +
      'La fuente oficial de este dato es el Squad 4 (Auth y Perfiles).',
  })
  @ApiOkResponse({ description: 'Usuario encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar perfil de usuario (Squad 4)',
    description:
      'Actualiza datos del usuario. Mantenido por Squad 4. Otros squads sólo consumen esta información.',
  })
  @ApiOkResponse({ description: 'Usuario actualizado.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario (Squad 4)',
    description:
      'Elimina un usuario. Este endpoint es de responsabilidad del Squad 4.',
  })
  @ApiNoContentResponse({ description: 'Usuario eliminado.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
