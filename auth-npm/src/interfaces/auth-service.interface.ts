import { Observable } from "rxjs";
import { VerifyTokenRequestDto } from "src/dto/verify-token-request.dto";
import { VerifyTokenResponseDto } from "src/dto/verify-token-response.dto";

export interface IAuthService {
  verifyToken(data: VerifyTokenRequestDto): Observable<VerifyTokenResponseDto>;
}
