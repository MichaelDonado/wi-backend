import { IsNotEmpty, IsString, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


class GeoLocation {
    @ApiProperty({ example: 40.7128, description: 'The latitude of the location' })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: -74.0060, description: 'The length of the location' })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}

export class CreateTripDto {

    @ApiProperty({ example: '65c66334deb81ca3d747358d', description: 'Passenger ID' })
    @IsNotEmpty()
    riderId: string;

    @ApiProperty({ type: GeoLocation, description: 'Start location of the trip' })
    @ValidateNested()
    @IsNotEmpty()
    startPosition: GeoLocation;

    @ApiProperty({ type: GeoLocation, description: 'Final location of the trip' })
    @ValidateNested()
    @IsNotEmpty()
    finalPosition: GeoLocation;

}
