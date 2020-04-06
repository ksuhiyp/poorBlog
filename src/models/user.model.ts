import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { isString } from 'util';
import { ArticleEntity } from '../entities/article.entity';

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

export interface UserResponseDTO {
  readonly id: number;
  readonly username: string;
  readonly bio?: string;
  readonly photo?: string;
  readonly articles?: Number[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface UserRequestDTO {
  username: string;
  id: number;
  bio?: string;
  photo?: string;
}
