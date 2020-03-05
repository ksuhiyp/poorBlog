import { IsString, MinLength, MaxLength, IsNotEmpty, IsLowercase, IsOptional } from "class-validator";

export class AuthorDto {
    @IsString()
    @IsLowercase()
    @MaxLength(10)
    @MinLength(4)
    @IsNotEmpty()
    readonly username?: string;
    @IsString()
    @MinLength(6)
    @MaxLength(16)
    @IsNotEmpty()
    @IsOptional()
    readonly password?: string;

}
