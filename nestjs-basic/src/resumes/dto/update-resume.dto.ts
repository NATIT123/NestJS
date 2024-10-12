import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

class UpdatedBy {
  @IsNotEmpty()
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

// class History {
//   @IsNotEmpty()
//   status: string;

//   @IsNotEmpty()
//   updatedAt: Date;

//   @ValidateNested()
//   @IsNotEmpty()
//   @Type(() => UpdatedBy)
//   updatedBy: UpdatedBy;
// }

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  // @IsNotEmpty({ message: 'History is not empty' })
  // @IsArray({ message: 'History must be a array' })
  // @ValidateNested()
  // @Type(() => History)
  // history: History;

  @IsNotEmpty()
  status: string;
}
