import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Url khong dc de trong' })
  url: string;

  @IsNotEmpty({ message: 'Status khong dc de trong' })
  status: string;

  @IsNotEmpty({ message: 'UserId khong dc de trong' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'CompanyId khong dc de trong' })
  companyId: string;

  @IsNotEmpty({ message: 'JobId khong dc de trong' })
  jobId: string;
}

export class CreateUserCVDto {
  @IsNotEmpty({ message: 'Url khong dc de trong' })
  url: string;

  @IsNotEmpty({ message: 'CompanyId khong dc de trong' })
  companyId: string;

  @IsNotEmpty({ message: 'JobId khong dc de trong' })
  jobId: string;
}
