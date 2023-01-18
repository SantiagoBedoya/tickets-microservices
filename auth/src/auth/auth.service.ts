import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  VerifyTokenRequest,
  VerifyTokenResponse,
} from './interfaces/verify-token.interface';
import { UserDocument } from './users/entities/user.entity';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email, false);
    if (!user) {
      throw new UnauthorizedException('invalid credentials (email)');
    }
    const isValid = await bcrypt.compare(signInDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('invalid credentials (password)');
    }
    const accessToken = this.generateAccessToken(user._id.toString());
    return { accessToken };
  }
  async signUp(signUpDto: SignUpDto) {
    const currentUser = await this.usersService.findOneByEmail(
      signUpDto.email,
      false,
    );
    if (currentUser) {
      throw new BadRequestException('email already in use');
    }
    const user = await this.usersService.create(signUpDto);
    const accessToken = this.generateAccessToken(user._id.toString());
    return { accessToken };
  }
  private generateAccessToken(userId: string) {
    return this.jwtService.sign({ userId });
  }

  async verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    try {
      const payload: JwtPayload = this.jwtService.verify(data.accessToken);
      const user = await this.usersService.findOne(payload.userId);
      return {
        isValid: true,
        user: { id: user._id.toString(), email: user.email },
      };
    } catch (err) {
      return { isValid: false, user: null };
    }
  }
}
