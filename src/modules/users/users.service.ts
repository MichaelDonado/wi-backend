import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { HandleErrorService } from '@/utils/handle-error/handle-error.service';

const USER_NOT_FOUND = 'User not found';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly handleErrorService: HandleErrorService,
  ) { }

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
      this.handleErrorService.handleDBErrors(error);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, _id: Types.ObjectId): Promise<User> {
    try {
      const { ...toUpdate } = updateUserDto;

      const exist = await this.userExist(_id);

      if (!exist) {
        return this.notFound(_id);
      }

      await this.userModel
        .updateOne({ _id }, { ...toUpdate }, { new: true })
        .lean();
      const user = await this.getUserById(_id);
      return user;
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }

  }

  async removeUser(id: Types.ObjectId): Promise<string> {
    try {
      const user = await this.getUserById(id);

      if (!user) {
        throw new NotFoundException(USER_NOT_FOUND);
      }

      const { fullName } = user;

      const result = await this.userModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }

      return `User has been successfully removed: ${fullName}`;
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }

  }

  private async notFound(_id: string | Types.ObjectId): Promise<any> {
    return {
      status: "Not Found",
      message: `User with id ${_id} does not exist`,
    };
  }

  private async userExist(_id: Types.ObjectId): Promise<boolean> {
    try {
      const user = await this.getUserById(_id);
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }

  }
}

