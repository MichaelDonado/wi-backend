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
import { ApiProperty } from '@nestjs/swagger'; // Importa el decorador de Swagger

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Dirección de correo electrónico del usuario',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña del usuario',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  fullName: string;

  @IsArray({ message: 'Roles debe ser un arreglo.' })
  @ArrayNotEmpty({ message: 'Roles no puede estar vacío.' })
  @IsNotEmpty({ each: true, message: 'Cada elemento del arreglo de roles no puede estar vacío.' })
  @IsIn(['driver', 'rider'], { each: true, message: 'Los roles deben ser "driver" o "rider".' })
  @ApiProperty({
    example: 'driver or rider',
    description: 'Nombre completo del rol',
  })
  roles: string[];

  

}
