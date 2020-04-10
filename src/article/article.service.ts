import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Repository, UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import {
  GetArticleByIdOrSlugQuery,
  GetArticlesQuery,
  UpdateArticleDTO,
  CreateArticleDTO,
} from 'src/models/article.model';
import { UserEntity } from 'src/entities/user.entity';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private repo: Repository<ArticleEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}
  getArticle(query?: GetArticleByIdOrSlugQuery): Promise<ArticleEntity> {
    return this.repo.findOneOrFail({
      where: {
        ...query,
      },
      relations: ['author'],
    });
  }
  getArticles(query?: GetArticlesQuery): Promise<ArticleEntity[]> {
    return this.repo.find({ ...query, relations: ['author'] });
  }
  async createArticle(
    data: CreateArticleDTO,
    author: UserEntity,
  ): Promise<ArticleEntity> {
    const articleEntity = this.repo.create(data);
    articleEntity.author = author;
    const tagList = articleEntity.tagList;
    if (tagList?.length) await this.saveTags(tagList);
    const article = await this.repo.save(articleEntity);
    return article;
  }
  async updateArticle(
    id: number,
    data: UpdateArticleDTO,
    user: UserEntity,
  ): Promise<UpdateResult> {
    const article = await this.repo.findOneOrFail(id, {
      relations: ['author'],
    });
    if (user.id === article.author?.id) {
      if (data.tagList?.length) await this.saveTags(data.tagList);
      return this.repo.update({ id }, data);
    }
    throw new ForbiddenException();
  }
  async deleteArticle(id: number, user: UserEntity): Promise<DeleteResult> {
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

  private async saveTags(tagList: string[]): Promise<InsertResult> {
    const tagEntities = tagList.map(title => {
      const tagEntity = new TagEntity();
      tagEntity.title = title;
      return tagEntity;
    });
    return this.tagRepo
      .createQueryBuilder()
      .insert()
      .into(TagEntity)
      .values(tagEntities)
      .orIgnore()
      .execute();
  }
}
