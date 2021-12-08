import {JwtToken} from './jwtToken.model';

export class AuthResult{

  token:JwtToken;

  constructor(token:JwtToken) {
    this.token = token;
  }
}
