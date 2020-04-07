import { IsString } from 'class-validator';

export class findAllQuery {
  @IsString()
  tag: string;
}
