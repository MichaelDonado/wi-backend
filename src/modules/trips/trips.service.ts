import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trip } from './models/trip.model';
import mongoose, { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';

const USER_NOT_FOUND = 'Usuario no encontrado';
const TRIP_NOT_FOUND = 'Viaje no encontrado';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
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
        return new NotFoundException('El usuario no es un rider');
      }

      if (!user.cardToken) {
        return new BadRequestException('Agrega un metodo de pago para continuar');
      }

      const _id = new Types.ObjectId();

      const driverFree = await this.getFreeDriver();

      if (!driverFree) {
        return new NotFoundException('No hay conductores disponibles en el momento');
      }

      const driverId = driverFree.toObject()._id;

      const trip = new this.tripModel({
        ...tripData,
        _id,
        riderId: new Types.ObjectId(riderId),
        driverId: new Types.ObjectId(driverId),
      });

      await this.updateStatusDriver(driverId, true);

      await trip.save();

      const newTrip = await this.tripModel.findById(trip._id);

      return { ...newTrip.toObject() }

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async completedTrip(id: Types.ObjectId) {
    const trip = await this.getTripById(id);
    const noFoundTrip = trip.response;

    if (noFoundTrip) {
      return noFoundTrip;
    }

    if (trip.status === 'final') {
      return new NotFoundException('Viaje finalizado')
    }

    const tripCompleted = await this.getTripFinishedAt(id);

    const distanceKm = this.calculateDistance(tripCompleted.startPosition, tripCompleted.finalPosition);

    const elapsedTimeMinutes = this.calculateElapsedTime(tripCompleted.created_at, tripCompleted.finished_at);

    const totalAmount = this.calculateTotalAmount(distanceKm, elapsedTimeMinutes);

    await this.tripModel
      .updateOne({ _id: id }, { price: totalAmount, status: 'final' }, { new: true })
      .lean();

    const completed = await this.tripModel.findById(trip._id);

    const driverId = trip.driverId;

    await this.updateStatusDriver(driverId, false);

    return { ...completed.toObject() }
  }

  private async getTripFinishedAt(_id: Types.ObjectId) {
    await this.tripModel
      .updateOne({ _id }, { finished_at: new Date().toISOString() }, { new: true })
      .lean();
    const trip = await this.getTripById(_id);
    return trip;
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
      this.handleDBErrors(error);
    }
  }

  private async updateStatusDriver(driverId: Types.ObjectId, isDriving: boolean) {
    await this.userModel
      .updateOne({ _id: driverId }, { isDriving })
      .lean();
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
      this.handleDBErrors(error)
    }
  }

  calculateDistance(startPosition: { latitude: number; longitude: number }, finalPosition: { latitude: number; longitude: number }): number {
    const earthRadiusKm = 6371;
    const lat1 = this.toRadians(startPosition.latitude);
    const lon1 = this.toRadians(startPosition.longitude);
    const lat2 = this.toRadians(finalPosition.latitude);
    const lon2 = this.toRadians(finalPosition.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;

    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateElapsedTime(startTime: Date, endTime: Date): number {
    const elapsedMilliseconds = endTime.getTime() - startTime.getTime();
    const elapsedMinutes = elapsedMilliseconds / (1000 * 60);

    return elapsedMinutes;
  }

  private calculateTotalAmount(distanceKm: number, elapsedTimeMinutes: number): number {
    const kmRate = 1000;
    const minuteRate = 200;
    const baseFee = 3500;

    const totalAmount = (distanceKm * kmRate) + (elapsedTimeMinutes * minuteRate) + baseFee;

    return Math.round(totalAmount);;
  }

  private handleDBErrors(error: any): never {
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

}
