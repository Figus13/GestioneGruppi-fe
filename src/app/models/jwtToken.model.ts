export class JwtToken
{
  email;
  exp;
  iat;
  sub;
  constructor(email, iat, exp, sub)
  {
    this.email = email;
    this.iat = iat;
    this.exp = exp;
    this.sub = sub;
  }
}
