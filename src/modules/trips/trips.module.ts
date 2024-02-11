import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './models/trip.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Trip.name,
        schema: TripSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
