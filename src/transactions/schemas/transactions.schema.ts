import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserSchema } from '../../users/schemas/users.schema';
import { TransactionStatus, TransactionType } from '../enums';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({timestamps: true})
export class Transaction {
  @Prop()
  amount: number;

  @Prop({ enum: TransactionType })
  type: TransactionType;

  @Prop({ enum: TransactionStatus })
  status: TransactionStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  @Type(() => User)
  userId: User;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
