import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({})
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty()
  password: string;

  phone: string;

  name: string;

  age: number;

  address: string;

  createdAt: Date;

  updatedAt: Date;
}