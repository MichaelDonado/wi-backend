import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_NOT_FOUND = 'Usuario no encontrado';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: Types.ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      
      if (!user) {
        throw new NotFoundException(USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new BadRequestException('ID no válido');
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, _id: Types.ObjectId): Promise<User>{
    const {...toUpdate} = updateUserDto;

    const exist = await this.userExist(_id);

    if(!exist){
      return this.notFound(_id);
    }

    await this.userModel
      .updateOne({ _id }, { ...toUpdate }, { new: true })
      .lean();
    const user = await this.getUserById(_id);
    return user;
  }

  async removeUser(id: Types.ObjectId): Promise<string> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const { fullName } = user;

    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return `Se ha eliminado con éxito al usuario: ${fullName}`;
  }

  private async notFound(_id: string | Types.ObjectId): Promise<any> {
    return {
      status: "Not Found",
      message: `User with id ${_id} does not exist`,
    };
  }

  private async userExist(_id: Types.ObjectId): Promise<boolean> {
    const user = await this.getUserById(_id);
    if (!user) {
      return false;
    }
    return true;
  }
}

