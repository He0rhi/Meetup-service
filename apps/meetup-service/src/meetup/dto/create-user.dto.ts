import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '1@gmail.com', description: 'email of user' })
  email: string;

  @ApiProperty({ example: '11111111', description: 'login of user' })
  login: string;

  @ApiProperty({ example: '135790', description: 'password of user' })
  password: string;

}

export class LoginUserDto {
  
    @ApiProperty({ example: '11111111', description: 'login of user' })
    login: string;
  
    @ApiProperty({ example: '135790', description: 'password of user' })
    password: string;
  
  }
