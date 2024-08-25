import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = { username: 'test', password: 'pass', email: "test@email.com" };
      const hashedPassword = 'hashed_pass';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(model, 'create').mockResolvedValue({ ...createUserDto, password: hashedPassword } as any);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual({ ...createUserDto, password: hashedPassword });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(model.create).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword });
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [{ username: 'test', password: 'hashed_pass' }];
      jest.spyOn(model, 'find').mockReturnValue({ exec: jest.fn().mockResolvedValue(users) } as any);

      const result = await service.findAllUsers();
      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const user = { username: 'test', password: 'hashed_pass' };
      jest.spyOn(model, 'findById').mockReturnValue({ exec: jest.fn().mockResolvedValue(user) } as any);

      const result = await service.findUserById('1');
      expect(result).toEqual(user);
      expect(model.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateUserDto = { username: 'test', password: 'new_pass', email: "test@email.com" };
      const hashedPassword = 'new_hashed_pass';
  

      jest.spyOn(bcrypt, 'hash')
        .mockImplementation((password: string, saltOrRounds: number) => {
          if (password === 'new_pass') {
            return Promise.resolve(hashedPassword);
          }
          return Promise.resolve(password); // Mock other cases as needed
        });
  
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue({ ...updateUserDto, password: hashedPassword } as any);
  
      const result = await service.updateUser('1', updateUserDto);
  
      expect(result).toEqual({ ...updateUserDto, password: hashedPassword });
      expect(bcrypt.hash).toHaveBeenCalledWith('new_pass', 10); // Check for the new password
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('1', { ...updateUserDto, password: hashedPassword }, { new: true });
    });
  });
  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(undefined as any);

      await service.deleteUser('1');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
