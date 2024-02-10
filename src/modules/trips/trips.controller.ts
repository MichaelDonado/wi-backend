import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, RoleProtected } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role.guard';

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

  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(+id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripsService.remove(+id);
  }
}
