import { IsOptional, IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { WhereExpression, OrderByCondition, Binary } from 'typeorm';
import { UserResponseDTO } from './user.model';
import { TagEntity } from 'src/entities/tag.entity';
import { Type } from 'class-transformer';
import { UserEntity } from 'src/entities/user.entity';
import { ImageEntity } from 'src/entities/image.entity';
import { isArray } from 'util';
import { type } from 'os';

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

export class ArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  body: string;
  @IsOptional()
  @IsArray()
  @Type(() => TagEntity)
  tagList?: TagEntity[];
  @IsOptional()
  description: string;
}
export class CreateArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @Type(() => UserEntity)
  author: Pick<UserEntity, 'username' | 'id'>;
}

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  body?: string;
  @IsOptional()
  @IsArray()
  @Type(() => TagEntity)
  tags?: TagEntity[];
  @IsOptional()
  description?: string;
}

export class ArticleResponseDTO {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  slug?: string;
  title?: string;
  body?: string;
  description?: string;
  author?: UserResponseDTO;
  tagList?: string[];
}

export class DeleteArticleImageDTO {
  @IsArray()
  @Type(() => ImageEntity)
  imagesToDelete: ImageEntity[];
}
