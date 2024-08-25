import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transactions.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User, UserDocument } from '../users/schemas/users.schema';
import { TransactionStatus, TransactionType } from './enums';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel("Transaction") private transactionModel: Model<TransactionDocument>,
    @InjectModel("User") private userModel: Model<UserDocument>,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const user = await this.userModel.findById(createTransactionDto.userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const transaction = await this.transactionModel.create({
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      status: TransactionStatus.PENDING,
      userId: createTransactionDto.userId,
    });

    if (createTransactionDto.type === TransactionType.DEBIT) {
      return this.handleDebitTransaction(transaction, user);
    } else if (createTransactionDto.type === TransactionType.CREDIT) {
      return this.handleCreditTransaction(transaction, user);
    } else {
      throw new BadRequestException('Invalid transaction type');
    }
  }

  private async handleDebitTransaction(transaction: TransactionDocument, user: UserDocument): Promise<Transaction> {
    if (user.walletBalance < transaction.amount) {
      transaction.status = TransactionStatus.FAILED;
      await transaction.save();
      throw new BadRequestException('Insufficient balance');
    }

    user.walletBalance -= transaction.amount;
    await user.save();

    transaction.status = TransactionStatus.COMPLETED;
    return transaction.save();
  }

  private async handleCreditTransaction(transaction: TransactionDocument, user: UserDocument): Promise<Transaction> {
    user.walletBalance += transaction.amount;
    await user.save();

    transaction.status = TransactionStatus.COMPLETED;
    return transaction.save();
  }
}
