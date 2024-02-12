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

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'User e-mail address',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter and one number.',
  })
  @ApiProperty({
    example: 'Password123',
    description: 'User password',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of user',
  })
  fullName: string;

  @IsArray({ message: 'Roles must be an arrangement.' })
  @ArrayNotEmpty({ message: 'Roles cannot be empty.' })
  @IsNotEmpty({ each: true, message: 'Each element of the role arrangement cannot be empty.' })
  @IsIn(['driver', 'rider'], { each: true, message: 'Roles must be "driver" or "rider".' })
  @ApiProperty({
    example: 'driver or rider',
    description: 'Role name',
  })
  roles: string[];
}

