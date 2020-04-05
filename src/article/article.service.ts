import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import {
  GetArticleByIdOrSlugQuery,
  GetArticlesQuery,
  UpdateArticleDTO,
  CreateArticleDTO,
} from 'src/models/article.model';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) {}
  getArticle(query?: GetArticleByIdOrSlugQuery): Promise<Article> {
    return this.repo.findOneOrFail({
      where: {
        ...
        query
      },
      relations: ['author'],
    });
  }
  getArticles(query?: GetArticlesQuery): Promise<Article[]> {
    return this.repo.find({ ...query, relations: ['author'] });
  }
  createArticle(article: CreateArticleDTO, author: User): Promise<Article> {
    const entity = this.repo.create(article);
    entity.author = author;
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
  async deleteArticle(id: number, user: User): Promise<DeleteResult> {
    const article = await this.repo.findOneOrFail(id, {
      relations: ['author'],
    });
    if (this.isArticleAuthor(user.id, article.author?.id))
      return this.repo.delete(id);
    throw new ForbiddenException(
      `User ${user.username} doesn\'t own article ${article.slug}`,
    );
  }

  private isArticleAuthor(userId: number, authorId: number): boolean {
    return userId === authorId ? true : false;
  }
}
