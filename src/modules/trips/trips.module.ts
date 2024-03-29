import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './models/trip.model';
import { AuthModule } from '../auth/auth.module';
import { CalculateAmountService } from '@/utils/calculate/calculate-amount.service';
import { HandleErrorService } from '@/utils/handle-error/handle-error.service';
import { PaymentsModule } from '../payments/payments.module';
import { PaymentsService } from '../payments/payments.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({}),
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
  providers: [TripsService, CalculateAmountService, HandleErrorService,PaymentsService],
  
})
export class TripsModule {}
