import { IsString, IsOptional } from 'class-validator';
import { ArticleDTO } from './article.model';

export class findAllQuery {
  @IsString()
  @IsOptional()
  title: string;
}

export class TagDTO {
  @IsString()
  title: string;
}
