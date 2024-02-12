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
  ApiParam,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user', required: true })
  getUserById(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user', required: true })
  @ApiBearerAuth()
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  updateUser(@Param('id', ParseMongoIdPipe) id:Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by ID (for administrators only)',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user', required: true })
  @ApiBearerAuth()
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  removeUser(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.usersService.removeUser(id);
  }
}

