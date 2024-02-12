import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class HandleErrorService {

    handleDBErrors(error: any): never {
        console.log(error);
        throw new InternalServerErrorException('Please check server logs');
    }
}
