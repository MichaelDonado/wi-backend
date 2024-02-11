/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User } from '../users/models/user.model';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, roles, ...userData } = createUserDto;

      // Generate a _id using  new Types.ObjectId()
      const _id = new Types.ObjectId();

      const user = new this.userModel({
        ...userData,
        _id,
        password: bcrypt.hashSync(password, 10),
        roles
      });

      if (roles.includes('rider')) {
        user.typePayment = null;
        user.cardToken = null;
      }

      if (roles.includes('driver')) {
        user.isDriving = false
      }

      // Saves the user in the database
      await user.save();

      // Obtain the user previously created
      const newUser = await this.userModel.findById(user._id);

      // If you wish, you can omit the password field in the answer.
      const { password: pass, ...userObject } = newUser.toObject();

      return {
        ...userObject,
        token: this.getJwtToken({ _id: newUser._id.toString() }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    
    const { password, email } = loginUserDto;

    const user = await this.userModel
      .findOne({
        email: email,
      })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }

    // encrypt the password
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      token: this.getJwtToken({ _id: user._id.toString() }),
    };
  }

  async checkAuthStatus(user: any) {
    return {
      ...user,
      token: this.getJwtToken({ _id: user._id.toString() }),
    };
  }
  // obtain the token and sign it
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // error handling
  private handleDBErrors(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        ` the user with the e-mail '${error.keyValue.email}' already exists in the database.`,
      );
    }

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}

