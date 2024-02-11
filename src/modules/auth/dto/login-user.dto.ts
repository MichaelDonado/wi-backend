import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
}

