import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import mongoose, { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{
    schema: UserSchema,
    name: "User"
  }])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
