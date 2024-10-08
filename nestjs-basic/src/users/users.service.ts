import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const getHashPassword = this.getHashPassword(createUserDto.password);
    createUserDto.password = getHashPassword;
    let user = await this.userModel.create(createUserDto);
    return { id: user._id };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { message: 'Id is not valid' };
    }
    let user = await this.userModel.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return { user: user };
  }

  async isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async findOneByUserName(userName: string) {
    return this.userModel.findOne({ email: userName });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { message: 'Id is not valid' };
    }
    let user = await this.userModel.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    try {
      let updateUser = await this.userModel.updateOne(
        { _id: id },
        { ...updateUserDto },
      );
    } catch (err) {
      return err;
    }
    return { message: true };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
