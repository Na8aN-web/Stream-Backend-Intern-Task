import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { Transaction, TransactionSchema } from '../src/transactions/schemas/transactions.schema';
import { User, UserSchema } from '../src/users/schemas/users.schema';
import { TransactionStatus, TransactionType } from '../src/transactions/enums';

describe('Transactions e2e', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb://localhost/test'), 
        MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup test data
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password', walletBalance: 100 });

    userId = userResponse.body._id;
  });

  it('should create a debit transaction successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 50, type: TransactionType.DEBIT, userId })
      .expect(201);

    expect(response.body).toHaveProperty('amount', 50);
    expect(response.body).toHaveProperty('type', TransactionType.DEBIT);
    expect(response.body).toHaveProperty('status', TransactionStatus.COMPLETED);
  });

  it('should fail to create a debit transaction due to insufficient balance', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 200, type: TransactionType.DEBIT, userId })
      .expect(400);
  });

  it('should create a credit transaction successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 50, type: TransactionType.CREDIT, userId })
      .expect(201);

    expect(response.body).toHaveProperty('amount', 50);
    expect(response.body).toHaveProperty('type', TransactionType.CREDIT);
    expect(response.body).toHaveProperty('status', TransactionStatus.COMPLETED);
  });

  afterAll(async () => {
    await app.close();
  });
});
