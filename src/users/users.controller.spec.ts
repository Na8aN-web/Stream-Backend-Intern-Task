import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { username: 'test', password: 'pass', email: "email@test.com" };
      const result: UserDocument = { ...createUserDto, _id: '1' } as any;
      jest.spyOn(service, 'createUser').mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{ username: 'test', password: 'hashed_pass' }] as any;
      jest.spyOn(service, 'findAllUsers').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result: User = { username: 'test', password: 'hashed_pass', _id: '1' } as any;
      jest.spyOn(service, 'findUserById').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findUserById).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(null as unknown as any);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto: CreateUserDto = { username: 'updatedTest', password: 'newPass', email: "test@gmail.com" };
      const result: User = { ...updateUserDto, _id: '1' } as any;
      jest.spyOn(service, 'updateUser').mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto)).toEqual(result);
      expect(service.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(null as unknown as any);

      await expect(controller.update('1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const user = { _id: '1', username: 'test', password: 'hashed_pass' } as any;
      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      jest.spyOn(service, 'deleteUser').mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.findUserById).toHaveBeenCalledWith('1');
      expect(service.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(null as unknown as any);

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
