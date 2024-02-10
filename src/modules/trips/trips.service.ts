import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trip } from './models/trip.model';
import mongoose, { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';

const USER_NOT_FOUND = 'Usuario no encontrado';

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

      const trip = new this.tripModel({
        ...tripData,
        _id,
        riderId,
      });

      await trip.save();

      const newTrip = await this.tripModel.findById(trip._id);
      
      return {...newTrip.toObject()}

    } catch (error) {
      this.handleDBErrors(error);
    }
    
  }

  findAll() {
    return `This action returns all trips`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }

  private handleDBErrors(error: any): never {
    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
