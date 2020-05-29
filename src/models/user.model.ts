import { IsString, MinLength, MaxLength, IsNotEmpty, IsLowercase, IsOptional, IsUrl } from 'class-validator';

export class UserRegistrationDTO {
  @IsString()
  @IsLowercase()
  @MaxLength(10)
  @MinLength(4)
  @IsNotEmpty()
  readonly username: string;
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  @IsOptional()
  password: string;
}

export class UserLoginDTO extends UserRegistrationDTO {
  constructor() {
    super();
  }
}
export class UserUpdateDTO {
  @IsString()
  @IsLowercase()
  @MaxLength(10)
  @MinLength(4)
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  bio?: string;

  @IsUrl()
  @IsOptional()
  photo?: string;
}

export class UserRequestDTO {
  id: number;
  username: string;
}

export interface UserResponseDTO {
  readonly id: number;
  readonly username: string;
  readonly bio?: string;
  readonly photo?: string;
  readonly articles?: number[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface UserRequestDTO {
  username: string;
  id: number;
  bio?: string;
  photo?: string;
}

export interface FindUserQuery {
  username?: string;
  id?: number;
}

export interface Credentials {
  username: string;
  password: string;
}
