import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Skills khong dc de trong' })
  skills: string[];

  @IsNotEmpty({ message: 'Location khong dc de trong' })
  location: string;

  @IsNotEmpty({ message: 'Salary khong dc de trong' })
  salary: number;

  @IsNotEmpty({ message: 'Quantity khong dc de trong' })
  quantity: number;

  @IsNotEmpty({ message: 'Level khong dc de trong' })
  level: string;

  @IsNotEmpty({ message: 'Desctiption khong dc de trong' })
  description: string;

  @IsNotEmpty({ message: 'StartDate khong dc de trong' })
  startDate: string;

  @IsNotEmpty({ message: 'EndDate khong dc de trong' })
  endDate: string;

  @IsNotEmpty({ message: 'isActive khong dc de trong' })
  isActive: boolean;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
