import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({ token: 'token' }),
            signUp: jest.fn().mockResolvedValue(new CreateUserDto()),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token on successful login', async () => {
      const signInDto: SignInDto = { email: 'john.doe@example.com', password: 'password' };
      const result = await controller.signIn(signInDto);
      expect(result).toEqual({ token: 'token' });
      expect(service.signIn).toHaveBeenCalledWith(signInDto.email, signInDto.password);
    });
  });

  describe('signUp', () => {
    it('should create a new user on successful signup', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john.doe@example.com', password: 'password' };
      const result = await controller.signUp(createUserDto);
      expect(result).toBeInstanceOf(CreateUserDto);
      expect(service.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });
});