import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculateAmountService {

    calculateDistance(startPosition: { latitude: number; longitude: number }, finalPosition: { latitude: number; longitude: number }): number {
        const earthRadiusKm = 6371;
        const lat1 = this.toRadians(startPosition.latitude);
        const lon1 = this.toRadians(startPosition.longitude);
        const lat2 = this.toRadians(finalPosition.latitude);
        const lon2 = this.toRadians(finalPosition.longitude);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = earthRadiusKm * c;

        return distance;
    }

    toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    calculateElapsedTime(startTime: Date, endTime: Date): number {
        const elapsedMilliseconds = endTime.getTime() - startTime.getTime();
        const elapsedMinutes = elapsedMilliseconds / (1000 * 60);

        return elapsedMinutes;
    }

    calculateTotalAmount(distanceKm: number, elapsedTimeMinutes: number): number {
        const kmRate = 1000;
        const minuteRate = 200;
        const baseFee = 3500;

        const totalAmount = (distanceKm * kmRate) + (elapsedTimeMinutes * minuteRate) + baseFee;

        return Math.round(totalAmount);;
    }

}
