import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import {
  GetArticleByIdOrSlugQuery,
  GetArticlesQuery,
  UpdateArticleDTO,
  CreateArticleDTO,
} from 'src/models/article.model';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly repo: Repository<Article>,
  ) {}
  getArticle(query?: GetArticleByIdOrSlugQuery): Promise<Article> {
    return this.repo.findOne({ where: { query } });
  }
  getArticles(query?: GetArticlesQuery): Promise<Article[]> {
    return this.repo.find({ ...query, relations: ['author'] });
  }
  createArticle(article: CreateArticleDTO, author: User): Promise<Article> {
    const entity = this.repo.create(article);
    entity.author.id = author.id;
    return this.repo.save(entity);
  }
  async updateArticle(
    id: number,
    data: UpdateArticleDTO,
    user: User,
  ): Promise<UpdateResult> {
    const article = await this.repo.findOne(id, { relations: ['author'] });
    if (user.id === article.author.id) {
      return this.repo.update({ id }, data);
    }
    throw new ForbiddenException();
  }
  deleteArticle(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
