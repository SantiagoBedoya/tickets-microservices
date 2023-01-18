import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import {
  VerifyTokenRequest,
  VerifyTokenResponse,
} from './interfaces/verify-token.interface';

import { User } from './users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('/currentuser')
  @Auth()
  currentUser(@CurrentUser() user: User) {
    return user;
  }

  @GrpcMethod('AuthService', 'VerifyToken')
  verifyToken(
    data: VerifyTokenRequest,
    metadata: Metadata,
    call: ServerUnaryCall<VerifyTokenRequest, VerifyTokenResponse>,
  ): Promise<VerifyTokenResponse> {
    return this.authService.verifyToken(data);
  }
}
