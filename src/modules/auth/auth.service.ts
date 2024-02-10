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

      // Genera un _id utilizando new Types.ObjectId()
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

      // Guarda el usuario en la base de datos
      await user.save();

      // Obtén el usuario recién creado
      const newUser = await this.userModel.findById(user._id);

      // Si lo deseas, puedes omitir el campo password en la respuesta
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
      throw new UnauthorizedException('Credenciales no válidas (email)');
    }

    // encryptar la password
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no válidas (contraseña)');
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
  // obtener el token y firmarlo
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // manejo de errores
  private handleDBErrors(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        `El usuario con el correo electrónico '${error.keyValue.email}' ya existe en la base de datos.`,
      );
    }

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
