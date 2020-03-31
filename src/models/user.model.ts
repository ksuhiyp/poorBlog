import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { User } from 'src/entities/user.entity';
import { isString } from 'util';
import { Article } from 'src/entities/article.entity';

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

export interface UserResponseDTO  {
  readonly id: number;
  readonly username: string;
  readonly bio?: string;
  readonly photo?: string;
  readonly articles?: Number[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
