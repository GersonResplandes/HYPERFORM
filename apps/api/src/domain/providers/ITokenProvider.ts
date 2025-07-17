export interface ITokenPayload {
  sub: string;
  email: string;
}

export interface ITokenProvider {
  generateToken(payload: ITokenPayload): string;
  verifyToken(token: string): ITokenPayload;
}
