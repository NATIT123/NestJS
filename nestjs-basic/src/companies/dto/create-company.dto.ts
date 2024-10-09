import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Address khong dc de trong' })
  address: string;

  @IsNotEmpty({ message: 'Description khong dc de trong' })
  description: string;
}
