import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trip } from './models/trip.model';
import mongoose, { Model, Types } from 'mongoose';
import { User } from '../users/models/user.model';
import { CalculateAmountService } from '@/utils/calculate/calculate-amount.service';
import { HandleErrorService } from '@/utils/handle-error/handle-error.service';
import { PaymentsService } from '../payments/payments.service';

const USER_NOT_FOUND = 'User not found';
const TRIP_NOT_FOUND = 'Trip not found';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly calculateAmountService: CalculateAmountService,
    private readonly handleErrorService: HandleErrorService,
    private readonly paymentsService: PaymentsService,
  ) { }

  async createTrip(createTripDto: CreateTripDto) {
    try {
      const { riderId, ...tripData } = createTripDto;

      const user = await this.userModel.findById(new mongoose.Types.ObjectId(riderId)).exec();
      if (!user) {
        return new NotFoundException(USER_NOT_FOUND);
      }

      const isRider = user.roles.includes('rider');

      if (!isRider) {
        return new NotFoundException('The user is not a rider');
      }

      if (!user.paymentSourceId) {
        return new BadRequestException('Add a payment method to continue');
      }

      const _id = new Types.ObjectId();

      const driverFree = await this.getFreeDriver();

      if (!driverFree) {
        return new NotFoundException('No drivers available at the moment');
      }

      const driverId = driverFree.toObject()._id;

      const trip = new this.tripModel({
        ...tripData,
        _id,
        riderId: new Types.ObjectId(riderId),
        driverId: new Types.ObjectId(driverId),
        paymentSourceId: user.paymentSourceId,
      });

      await this.updateStatusDriver(driverId, true);

      await trip.save();

      const newTrip = await this.tripModel.findById(trip._id);

      return { ...newTrip.toObject() }

    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }

  }

  async completedTrip(id: Types.ObjectId) {
    try {
      const trip = await this.getTripById(id);
      const noFoundTrip = trip.response;

      if (noFoundTrip) {
        return noFoundTrip;
      }

      if (trip.status === 'final') {
        return new NotFoundException('Trip completed')
      }

      const tripCompleted = await this.getTripFinishedAt(id);

      const distanceKm = this.calculateAmountService.calculateDistance(tripCompleted.startPosition, tripCompleted.finalPosition);

      const elapsedTimeMinutes = this.calculateAmountService.calculateElapsedTime(tripCompleted.created_at, tripCompleted.finished_at);

      const totalAmount = this.calculateAmountService.calculateTotalAmount(distanceKm, elapsedTimeMinutes);
      
      const user = await this.userModel.findById(new mongoose.Types.ObjectId(trip.riderId)).exec();

      const requestPayload = {
        price: totalAmount,
        email: user.email,
        reference: `trip_${trip._id}`,
        paymentSourceId: trip.paymentSourceId,
      };

      const transactionId = await this.paymentsService.createTransaction(requestPayload)

      await this.tripModel
        .updateOne({ _id: id }, { price: totalAmount, status: 'final', transactionId }, { new: true })
        .lean();

      const completed = await this.tripModel.findById(trip._id);

      const driverId = trip.driverId;

      await this.updateStatusDriver(driverId, false);

      return { ...completed.toObject() }

    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }

  }

  private async getTripFinishedAt(_id: Types.ObjectId) {
    try {
      await this.tripModel
        .updateOne({ _id }, { finished_at: new Date().toISOString() }, { new: true })
        .lean();
      const trip = await this.getTripById(_id);
      return trip;
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }
  }

  async getTripById(id: Types.ObjectId): Promise<Trip | any> {
    try {
      const trip = await this.tripModel.findById(id).exec();

      if (!trip) {
        return new NotFoundException(TRIP_NOT_FOUND);
      }

      return trip;
    } catch (error) {
      console.log(error)
      this.handleErrorService.handleDBErrors(error);
    }
  }

  private async updateStatusDriver(driverId: Types.ObjectId, isDriving: boolean) {
    try {
      await this.userModel
        .updateOne({ _id: driverId }, { isDriving })
        .lean();
    } catch (error) {
      console.log(error)
      this.handleErrorService.handleDBErrors(error);
    }
  }

  private async getFreeDriver() {
    try {
      const driver = await this.userModel
        .findOne()
        .where('roles').in(['driver'])
        .where('isDriving').equals(false)
        .exec();

      return driver;
    } catch (error) {
      this.handleErrorService.handleDBErrors(error)
    }
  }
}
