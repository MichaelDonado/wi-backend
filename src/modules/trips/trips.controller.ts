import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, RoleProtected } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { ParseMongoIdPipe } from '@/core/pipes/parse-mongo-id.pipe';
import { Types } from 'mongoose';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('create')
  // @ApiBearerAuth()
  // @Auth()
  // @RoleProtected(ValidRoles.rider)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiOperation({ summary: 'Registra un nuevo viaje' })
  @ApiResponse({
    status: 200,
    description: 'retorna el viaje creado',
  })
  createTrip(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.createTrip(createTripDto);
  }

  @Get(':id')
  getTripById(@Param('id', ParseMongoIdPipe) id:Types.ObjectId) {
    return this.tripsService.getTripById(id);
  }

}
