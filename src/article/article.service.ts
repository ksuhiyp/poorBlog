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
import { PhotoEntity } from 'src/entities/photo.entity';
import { Tag } from 'aws-sdk/clients/swf';
import { UserRequestDTO } from 'src/models/user.model';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private repo: Repository<ArticleEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
    @InjectRepository(PhotoEntity) private photoRepo: Repository<PhotoEntity>,
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
    author: UserRequestDTO,
    files: ArticlePhotosMulterS3Files,
  ): Promise<ArticleEntity> {
    const articleEntity = new ArticleEntity(data, author, files);
    await this.saveTags(articleEntity.tagList);
    const article = await this.repo.save(articleEntity);
    return article;
  }
  async updateArticle(
    id: number,
    data: UpdateArticleDTO,
    user: Omit<UserEntity, 'password' | 'createdAt' | 'updatedAt'>,
    files: ArticlePhotosMulterS3Files,
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
  async deleteArticle(
    id: number,
    user: Omit<UserEntity, 'password' | 'createdAt'>,
  ): Promise<DeleteResult> {
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

  private async saveTags(tagList: TagEntity[]): Promise<InsertResult> {
    return this.tagRepo
      .createQueryBuilder()
      .insert()
      .into(TagEntity)
      .values(tagList)
      .orIgnore()
      .execute();
  }

}
