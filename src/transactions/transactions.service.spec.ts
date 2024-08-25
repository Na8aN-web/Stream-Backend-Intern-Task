import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionDocument } from './schemas/transactions.schema';
import { User, UserDocument } from '../users/schemas/users.schema';
import { BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType, TransactionStatus } from './enums';
import { Model } from 'mongoose';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: Model<TransactionDocument>;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            // Mocking the model constructor behavior
            create: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            // Mocking the model constructor behavior
            findById: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionModel = module.get<Model<TransactionDocument>>(getModelToken(Transaction.name));
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should throw BadRequestException if user is not found', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
        userId: '64e4bfc8a4f9b022cc4f9e6f' as any,
      };

      await expect(service.createTransaction(createTransactionDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle debit transactions correctly', async () => {
      const user = { walletBalance: 200, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(userModel, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(user),
      } as any);

      const transactionInstanceMock = {
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
        userId: user,
        save: jest.fn().mockResolvedValue({
          amount: 100,
          type: TransactionType.DEBIT,
          status: TransactionStatus.COMPLETED,
          userId: user,
        }),
      };

      jest.spyOn(transactionModel, 'create').mockReturnValueOnce(transactionInstanceMock as any);

      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
        userId: '64e4bfc8a4f9b022cc4f9e6f' as any,
      };

      const result = await service.createTransaction(createTransactionDto);

      expect(result.status).toBe(TransactionStatus.COMPLETED);
      expect(user.walletBalance).toBe(100);
      expect(user.save).toHaveBeenCalled();
      expect(transactionInstanceMock.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if balance is insufficient for debit', async () => {
      const user = { walletBalance: 50, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(userModel, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(user),
      } as any);

      const transactionInstanceMock = {
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
        userId: user,
        save: jest.fn().mockResolvedValue({
          amount: 100,
          type: TransactionType.DEBIT,
          status: TransactionStatus.FAILED,
          userId: user,
        }),
      };

      jest.spyOn(transactionModel, 'create').mockReturnValueOnce(transactionInstanceMock as any);

      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
        userId: '64e4bfc8a4f9b022cc4f9e6f' as any,
      };

      await expect(service.createTransaction(createTransactionDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(transactionInstanceMock.save).toHaveBeenCalled();
    });

    it('should handle credit transactions correctly', async () => {
      const user = { walletBalance: 200, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(userModel, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(user),
      } as any);

      const transactionInstanceMock = {
        amount: 100,
        type: TransactionType.CREDIT,
        status: TransactionStatus.PENDING,
        userId: user,
        save: jest.fn().mockResolvedValue({
          amount: 100,
          type: TransactionType.CREDIT,
          status: TransactionStatus.COMPLETED,
          userId: user,
        }),
      };

      jest.spyOn(transactionModel, 'create').mockReturnValueOnce(transactionInstanceMock as any);

      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        type: TransactionType.CREDIT,
        status: TransactionStatus.PENDING,
        userId: '64e4bfc8a4f9b022cc4f9e6f' as any,
      };

      const result = await service.createTransaction(createTransactionDto);

      expect(result.status).toBe(TransactionStatus.COMPLETED);
      expect(user.walletBalance).toBe(300);
      expect(user.save).toHaveBeenCalled();
      expect(transactionInstanceMock.save).toHaveBeenCalled();
    });
  });
});
