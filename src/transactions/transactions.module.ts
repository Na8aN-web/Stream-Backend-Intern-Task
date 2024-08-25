import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/users.schema';
import { TransactionSchema } from './schemas/transactions.schema';

@Module({
  imports: [MongooseModule.forFeature([{
    schema: UserSchema, 
    name: "User"
  },{
    schema: TransactionSchema,
    name: "Transaction"
  }])], 
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
