import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @ApiOperation({ summary: 'Register a payment method' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @Post('create-payment-method')
  createPaymentMethod(@Body() createPaymentDto: CreatePaymentDto){
    return this.paymentService.createPaymentMethod(createPaymentDto);
  }

  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @Post('create-transaction')
  createTransaction(@Body() createTransactionDto: CreateTransactionDto){
    return this.paymentService.createTransaction(createTransactionDto);
  }
  
}
