import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { HandleErrorService } from '@/utils/handle-error/handle-error.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({}),
    ConfigModule,
    AuthModule,
  ],

  controllers: [PaymentsController],
  providers: [PaymentsService, HandleErrorService],
})
export class PaymentsModule {}
