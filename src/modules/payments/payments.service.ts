import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../users/models/user.model';
import { HandleErrorService } from '@/utils/handle-error/handle-error.service';
import { HttpService } from '@nestjs/axios';
import { catchError, switchMap, throwError } from 'rxjs';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class PaymentsService {
  private readonly wiApiBaseUrl = process.env.WI_API;
  private readonly publicKey = process.env.PUBLIC_KEY;
  private readonly privateKey = process.env.PRIVATE_KEY;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
    private readonly handleErrorService: HandleErrorService,
  ) { }

  async createPaymentMethod({ riderId }: CreatePaymentDto) {
    try {
      const userRider = await this.userModel.findById(new Types.ObjectId(riderId)).exec();

      if (!userRider) {
        return new NotFoundException('User not found');
      }

      const isRider = userRider.roles.includes('rider');

      if (!isRider) {
        return new NotFoundException('The user is not a rider');
      }

      if (userRider.paymentSourceId) {
        return new BadRequestException('This user already has a payment method');
      }

      const requestPayload = {
        number: '4242424242424242',
        exp_month: '06',
        exp_year: '29',
        cvc: '123',
        card_holder: userRider.fullName,
      };

      return this.httpService
        .post(`${this.wiApiBaseUrl}tokens/cards`, requestPayload, {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
          },
        })
        .pipe(
          switchMap(async ({ data }) => {
            const cardToken = data.data.id;
            const { email } = userRider;

            const PaymentSource = await this.createPaymentSource(riderId, cardToken, email);

            return PaymentSource;
          }),
          catchError((error) => {
            return this.handleErrorService.handleDBErrors(error);
          }),
        )
        .toPromise();
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }
  }

  async createPaymentSource(riderId: string, cardToken: string, email: string) {
    try {
      const acceptanceToken = await this.getTokenAceptation();

      const requestPayload = {
        type: "CARD",
        token: cardToken,
        customer_email: email,
        acceptance_token: acceptanceToken,
      }

      return this.httpService
        .post(`${this.wiApiBaseUrl}payment_sources`, requestPayload, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        })
        .pipe(
          switchMap(async ({ data }) => {
            const paymentSourceId = data.data.id;
            await this.userModel
              .updateOne(
                { _id: new Types.ObjectId(riderId) },
                { typePayment: 'card', paymentSourceId },
                { new: true }
              )
              .lean();

            return data;
          }),
          catchError((error) => {
            return this.handleErrorService.handleDBErrors(error);
          }),
        )
        .toPromise();
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    try {
      const { price, email, reference, paymentSourceId } = createTransactionDto;
      const amountInCents = price * 100; // must be multiplied by 100 because the amount in cents of the transaction. For example, for $9,500 is 950000. https://docs.wompi.co/docs/colombia/seguimiento-de-transacciones

      const requestPayload = {
        amount_in_cents: amountInCents,
        currency: 'COP',
        customer_email: email,
        payment_method: {
          installments: 2,
        },
        reference: reference,
        payment_source_id: paymentSourceId,
      };

      const response = await this.httpService
        .post(`${this.wiApiBaseUrl}transactions`, requestPayload, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        })
        .pipe(
          switchMap(async ({ data }) => {
            const transactionId = data.data.id;
            return transactionId; 
          }),
          catchError((error) => {
            this.handleErrorService.handleDBErrors(error);
            return throwError(error);
          }),
        )
        .toPromise();

      return response; 
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }
  }

  private async getTokenAceptation() {
    try {
      return this.httpService
        .get(`${this.wiApiBaseUrl}merchants/${this.publicKey}`)
        .pipe(
          switchMap(async ({ data }) => {
            const acceptanceToken = data.data.presigned_acceptance.acceptance_token;
            return acceptanceToken;
          }),
          catchError((error) => {
            return this.handleErrorService.handleDBErrors(error);
          }),
        )
        .toPromise();
    } catch (error) {
      this.handleErrorService.handleDBErrors(error);
    }
  }
}
