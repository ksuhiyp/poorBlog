import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
  IsOptional,
} from 'class-validator';

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
}


