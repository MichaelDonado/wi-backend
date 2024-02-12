import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger'; 

  export class CreatePaymentDto {
    @ApiProperty({ example: '65c66334deb81ca3d747358d', description: 'Passenger ID' })
    @IsNotEmpty()
    riderId: string;
  }
  
  