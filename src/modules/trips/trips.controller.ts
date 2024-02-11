import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Register a new trip' })
  @ApiResponse({
    status: 200,
    description: 'Return trip created',
  })
  createTrip(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.createTrip(createTripDto);
  }

  @ApiOperation({ summary: 'Completed trip' })
  @ApiResponse({
    status: 200,
    description: 'Return trip completed',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID of the trip', required: true })
  @Patch(':id')
  completedTrip(@Param('id', ParseMongoIdPipe) id:Types.ObjectId) {
    return this.tripsService.completedTrip(id);
  }

  @ApiOperation({ summary: 'Search for a trip by id' })
  @ApiResponse({
    status: 200,
    description: 'Return trip by id',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID of the trip', required: true })
  @Get(':id')
  getTripById(@Param('id', ParseMongoIdPipe) id:Types.ObjectId) {
    return this.tripsService.getTripById(id);
  }

}
