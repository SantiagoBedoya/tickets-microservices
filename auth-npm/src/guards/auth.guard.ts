import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { IAuthService } from "src/interfaces/auth-service.interface";

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private authService: IAuthService;
  constructor(
    @Inject("AUTH_CLIENT")
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<IAuthService>("AuthService");
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new UnauthorizedException();

    const tokenParts = authHeader.split(" ");

    if (tokenParts.length < 2) {
      throw new UnauthorizedException();
    }

    const token = tokenParts[1];
    const resp = await lastValueFrom(
      this.authService.verifyToken({ accessToken: token })
    );

    if (!resp.isValid) throw new UnauthorizedException();

    req.user = resp.user;

    return true;
  }
}
