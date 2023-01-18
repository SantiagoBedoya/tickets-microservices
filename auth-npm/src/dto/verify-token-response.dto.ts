import { UserDto } from "./user.dto";

export class VerifyTokenResponseDto {
  isValid: boolean;
  user?: UserDto;
}
