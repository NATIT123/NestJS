import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsEmail({})
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Password khong dc de trong' })
  password: string;

  @IsNotEmpty({ message: 'Phone khong dc de trong' })
  phone: string;

  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Gender khong dc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'Age khong dc de trong' })
  age: number;

  @IsNotEmpty({ message: 'Address khong dc de trong' })
  address: string;

  @IsNotEmpty({ message: 'Role khong dc de trong' })
  role: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsEmail({})
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Password khong dc de trong' })
  password: string;

  @IsNotEmpty({ message: 'Phone khong dc de trong' })
  phone: string;

  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Gender khong dc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'Age khong dc de trong' })
  age: number;

  @IsNotEmpty({ message: 'Address khong dc de trong' })
  address: string;
}
