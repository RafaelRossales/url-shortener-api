import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './auth-public-strategy';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  signIn(@Body() body: SignInDto) {
    const { email, password } = body;
    return this.authService.signIn(email,password);
  }

  @Public()
  @HttpCode(201)
  @Post('signup')
  @ApiOperation({ summary: 'User sign up' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  signUp(@Body() signUpDto:CreateUserDto){
    const payload = {
      email: signUpDto.email,
      password: signUpDto.password,
      name: signUpDto.name
    }
    return this.authService.signUp(payload);
  }
}
