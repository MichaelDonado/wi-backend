import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { ParseMongoIdPipe } from '@/core/pipes/parse-mongo-id.pipe';
import { Types } from 'mongoose';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  getUserById(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario por ID',
  })
  @ApiBearerAuth()
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  updateUser(@Param('id', ParseMongoIdPipe) id:Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiOperation({
    summary: 'Eliminar un usuario por ID (solo para administradores)',
  })
  removeUser(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.usersService.removeUser(id);
  }
}
