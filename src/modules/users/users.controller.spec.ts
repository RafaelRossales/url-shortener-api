import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

const mokeuuid = '90855jjgiogpçltkpotrhphk';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(new UserEntity()),
            create: jest.fn().mockResolvedValue(new UserEntity()),
            update: jest.fn().mockResolvedValue(new UserEntity()),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne(mokeuuid);
      expect(result).toBeInstanceOf(UserEntity);
      expect(service.findOne).toHaveBeenCalledWith(mokeuuid);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userDto = { name: 'John Doe', email: 'john.doe@example.com', password: 'password' };
      const result = await controller.update(mokeuuid, userDto);
      expect(result).toBeInstanceOf(UserEntity);
      expect(service.update).toHaveBeenCalledWith(mokeuuid, userDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove(mokeuuid);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(mokeuuid);
    });
  });
});