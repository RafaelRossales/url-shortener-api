import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token if credentials are valid', async () => {
      const user = new UserEntity();
      user.id = 'some-uuid';
      user.email = 'john.doe@example.com';
      user.password = 'password';

      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.signIn('john.doe@example.com', 'password');
      expect(result).toEqual({ token: 'token' });
      expect(usersService.findOneBy).toHaveBeenCalledWith('john.doe@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, email: user.email });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(null);

      await expect(service.signIn('john.doe@example.com', 'password')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = new UserEntity();
      user.id = 'some-uuid';
      user.email = 'john.doe@example.com';
      user.password = 'password';

      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(user);

      await expect(service.signIn('john.doe@example.com', 'wrong-password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john.doe@example.com', password: 'password' };
      const user = new UserEntity();

      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await service.signUp(createUserDto);
      expect(result).toBe(user);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});