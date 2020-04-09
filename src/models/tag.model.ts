import { IsString, IsOptional } from 'class-validator';

export class findAllQuery {
  @IsString()
  @IsOptional()
  title: string;
}
