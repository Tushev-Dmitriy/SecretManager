import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessDto {
  @ApiProperty({
    description: 'Сообщение о успешной аутентификации',
    example: 'Successfully logged in with Keycloak SSO',
  })
  message: string;

  @ApiProperty({
    description: 'JWT токен для дальнейшей авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
