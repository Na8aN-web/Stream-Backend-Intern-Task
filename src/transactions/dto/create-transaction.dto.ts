import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { TransactionStatus, TransactionType } from '../enums';


export class CreateTransactionDto {
  @ApiProperty({
    description: 'The amount involved in the transaction.',
    example: 150.75,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The type of transaction, either "debit" or "credit".',
    example: 'credit',
  })
  @IsNotEmpty()
  @IsEnum(TransactionType, {
    message: 'type must be either "debit" or "credit"',
  })
  type: TransactionType;

  @ApiProperty({
    description: 'The current status of the transaction, either "pending", "completed", or "failed".',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus, {
    message: 'status must be either "pending", "completed", or "failed"',
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'The ID of the user associated with this transaction.',
    example: '64e4bfc8a4f9b022cc4f9e6f',
  })
  @IsNotEmpty()
  userId: Types.ObjectId;
}
