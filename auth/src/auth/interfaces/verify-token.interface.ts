export interface VerifyTokenRequest {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
}

export interface VerifyTokenResponse {
  isValid: boolean;
  user: User;
}
