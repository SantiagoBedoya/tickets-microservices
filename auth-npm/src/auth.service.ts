import { Inject, Injectable } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { VerifyTokenRequestDto } from "./dto/verify-token-request.dto";
import { VerifyTokenResponseDto } from "./dto/verify-token-response.dto";
import { IAuthService } from "./interfaces/auth-service.interface";

@Injectable()
export class AuthService {
  private readonly authService: IAuthService;

  constructor(
    @Inject("AUTH_CLIENT")
    private readonly client: ClientGrpc
  ) {
    this.authService = this.client.getService<IAuthService>("AuthService");
  }

  async verifyToken(
    verifyTokenRequestDto: VerifyTokenRequestDto
  ): Promise<VerifyTokenResponseDto> {
    const resp = await lastValueFrom(
      this.authService.verifyToken(verifyTokenRequestDto)
    );
    return resp;
  }
}
