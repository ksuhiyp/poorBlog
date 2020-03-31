import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import {
  GetArticleByIdOrSlugQuery,
  GetArticlesQuery,
  UpdateArticleDTO,
  CreateArticleDTO,
} from 'src/models/article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly repo: Repository<Article>,
  ) {}
  getArticle(query?: GetArticleByIdOrSlugQuery): Promise<Article> {
    return this.repo.findOne({ where: { query } });
  }
  getArticles(query?: GetArticlesQuery): Promise<Article[]> {
    return this.repo.find(query);
  }
  createArticle(article: CreateArticleDTO): Promise<Article> {
    const entity = this.repo.create(article);
    return this.repo.save(entity);
  }
  updateArticle(id: number, data: UpdateArticleDTO): Promise<UpdateResult> {
    return this.repo.update({ id }, data);
  }
  deleteArticle(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
