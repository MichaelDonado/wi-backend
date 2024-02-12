import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 8000000, description: 'price of trip' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'User e-mail address',
  })
  email: string;

  @ApiProperty({ example: 'trip_65ca5a1b9c62e2028312e5d4', description: 'Payment reference' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ example: 99146, description: 'Payment source ID' })
  @IsNotEmpty()
  @IsNumber()
  paymentSourceId: number;
}
