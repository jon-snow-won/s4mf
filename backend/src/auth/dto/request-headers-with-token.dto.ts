import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class TokenData {
  permissions: Array<string>;
  roles: Array<string>;
  name: string;
  exp: number;
  login: string;
  iat: number;
  email: string;
}

export class RequestHeadersWithTokenDto {
  @ApiProperty()
  headers: object;

  @ApiProperty({ type: TokenData || String })
  tokenInfo: string | TokenData;

  @ApiProperty({ type: User })
  user: User;
}
