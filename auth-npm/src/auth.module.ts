import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AuthService } from "./auth.service";
import { AuthOptionsDto } from "./dto/auth-options.dto";
import { AuthGuard } from "./guards/auth.guard";

@Module({})
export class AuthModule {
  static register(options: AuthOptionsDto): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        ClientsModule.register([
          {
            name: "AUTH_CLIENT",
            transport: Transport.GRPC,
            options: {
              package: "auth",
              protoPath: join(__dirname, "pb/auth.proto"),
              url: options.url,
            },
          },
        ]),
      ],
      providers: [AuthService, AuthGuard],
      exports: [AuthService, AuthGuard, ClientsModule],
    };
  }
}
