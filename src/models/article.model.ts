import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { WhereExpression, OrderByCondition } from 'typeorm';
import { UserResponseDTO } from './user.model';

export class GetArticleByIdOrSlugQuery {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsOptional()
  @IsString()
  slug?: string;
}
export class GetArticlesByTagName {
  @IsOptional()
  @IsString()
  tag?: string;
}

export enum order {
  'ASC',
  'DESC',
}
export class GetArticlesQuery {
  take?: number;
  skip?: number;
  order?: OrderByCondition;
  where?: WhereExpression;
}

export class CreateArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  body: string;
  @IsOptional()
  tagList?: string[];
  @IsOptional()
  describtion: string;
}

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  body?: string;
  @IsOptional()
  tagList?: string[];
  @IsOptional()
  describtion?: string;
}

export class articleResponseDTO {
  id?: Number;
  createdAt?: Date;
  updatedAt?: Date;
  slug?: string;
  title?: string;
  body?: string;
  describtion?: string;
  author?: UserResponseDTO;
  tagList?: string[];
}
