import { IsNotEmpty, IsString, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


class GeoLocation {
    @ApiProperty({ example: 40.7128, description: 'La latitud de la ubicación' })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: -74.0060, description: 'La longitud de la ubicación' })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}

export class CreateTripDto {

    @ApiProperty({ example: '65c66334deb81ca3d747358d', description: 'ID del pasajero' })
    @IsNotEmpty()
    riderId: string;

    @ApiProperty({ type: GeoLocation, description: 'Ubicación de inicio del viaje' })
    @ValidateNested()
    @IsNotEmpty()
    startPosition: GeoLocation;

    @ApiProperty({ type: GeoLocation, description: 'Ubicación final del viaje' })
    @ValidateNested()
    @IsNotEmpty()
    finalPosition: GeoLocation;

}
