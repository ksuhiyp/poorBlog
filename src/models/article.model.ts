import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { isString } from 'util';
import { FindOptionsUtils, WhereExpression, OrderByCondition } from 'typeorm';

export class GetArticleByIdOrSlugQuery {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsOptional()
  @IsString()
  slug?: string;
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
  tags: string[];
  @IsOptional()
  describtion: string;
}

export class UpdateArticleDTO {
  @IsString()
  @IsNotEmpty()
  title?: string;
  @IsString()
  @IsNotEmpty()
  body?: string;
  @IsOptional()
  tags?: string[];
  @IsOptional()
  describtion?: string;
}
