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
import global from 'multer';
import { PhotoEntity } from 'src/entities/photo.entity';
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
    author: Omit<UserEntity, 'password' | 'createdAt' | 'updatedAt'>,
    files: MulterS3File[],
  ): Promise<ArticleEntity> {
    const articleEntity = this.repo.create(data);
    articleEntity.author = author;
    const tagList = articleEntity.tagList;
    if (tagList?.length) await this.saveTags(tagList);
    // const photos = await this.savePhotos(files, articleEntity);
    const articlePhoto = files.find(file => file.fieldname === 'main');
    const articlePhotos = files.filter(file => file.fieldname !== 'main');
    articleEntity.photo = this.photoRepo.create(articlePhoto);
    articleEntity.photos = articlePhotos.map(photo =>
      this.photoRepo.create(photo),
    );
    const article = await this.repo.save(articleEntity);
    return article;
  }
  async updateArticle(
    id: number,
    data: UpdateArticleDTO,
    user: Omit<UserEntity, 'password' | 'createdAt' | 'updatedAt'>,
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

  // private savePhotos(files: MulterS3File[], article: ArticleEntity) {
  //   if (files) {
  //     const photos = files.map(file => {
  //       return this.photoRepo.create({
  //         article,
  //         bucket: file.bucket,
  //         key: file.key,
  //         location: file.location,
  //         type: file.fieldname === 'main' ? 'main' : 'article',
  //       });
  //     });
  //     return this.photoRepo.save(photos);
  //   }
  // }
}
