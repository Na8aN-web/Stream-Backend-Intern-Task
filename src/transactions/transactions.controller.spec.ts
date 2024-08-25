
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transactions.schema';
import { BadRequestException } from '@nestjs/common';
import { TransactionStatus, TransactionType } from './enums';
import { ObjectId } from 'mongoose';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransaction = {
    amount: 100,
    type: 'CREDIT',
    status: 'COMPLETED',
    userId: 'userId123',
  };

  const mockTransactionsService = {
    createTransaction: jest.fn().mockResolvedValue(mockTransaction),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        type: TransactionType.CREDIT,
        userId: 'userId123' as unknown as any,
        status: TransactionStatus.PENDING
      };
      const result = await controller.create(createTransactionDto);
      expect(result).toEqual(mockTransaction);
      expect(service.createTransaction).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should handle errors from service', async () => {
      jest.spyOn(service, 'createTransaction').mockRejectedValue(new BadRequestException('Invalid request'));
      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        type: TransactionType.CREDIT,
        userId: 'userId123' as unknown as any,
        status: TransactionStatus.PENDING
      };
      await expect(controller.create(createTransactionDto)).rejects.toThrow(BadRequestException);
    });
  });
});
