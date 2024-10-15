import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail({ message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsArray({ message: 'Must be an array skills' })
  @IsNotEmpty({ message: 'Skills khong dc de trong' })
  @IsString({ each: true, message: 'Skill must be a string' })
  skills: string[];
}
