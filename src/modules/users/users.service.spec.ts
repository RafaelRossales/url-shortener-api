import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john.doe@example.com', password: 'password' };
      const user = new UserEntity();
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(result).toBe(user);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new UserEntity()];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toBe(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = new UserEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne('some-uuid');
      expect(result).toBe(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('some-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneBy', () => {
    it('should return a single user by email', async () => {
      const user = new UserEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneBy('john.doe@example.com');
      expect(result).toBe(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe', email: 'john.doe@example.com', password: 'password' };
      const user = new UserEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.update('some-uuid', updateUserDto);
      expect(result).toBe(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('some-uuid', {} as UpdateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const user = new UserEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      await service.remove('some-uuid');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(user.deletedAt).toBeInstanceOf(Date);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('some-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});