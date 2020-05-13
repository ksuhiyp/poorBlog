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
      relations: ['author','photos'],
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
    const articleEntity = await this.initArticleEntity(data, author, files);
    await this.tagRepo
      .createQueryBuilder()
      .insert()
      .into(TagEntity)
      .values(articleEntity.tagList)
      .orIgnore()
      .execute();
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

  private async saveTags(tagList: any): Promise<InsertResult> {
    tagList = JSON.parse(tagList) as Tag[];
    const tagEntities = tagList.map(tag => {
      const tagEntity = new TagEntity();
      tagEntity.title = tag.title;
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

  private async initArticleEntity(
    data: Partial<CreateArticleDTO>,
    author: UserRequestDTO,
    files: ArticlePhotosMulterS3Files,
  ): Promise<ArticleEntity> {
    const articleEntity = new ArticleEntity();
    articleEntity.title = data.title;
    articleEntity.body = data.body;
    articleEntity.description = data.description;
    articleEntity.tagList = await this.initTaglistEntity(data);
    articleEntity.author = author;
    articleEntity.photos = this.initArticlePhotos(files, articleEntity);
    return articleEntity;
  }

  private initArticlePhotos(
    files: ArticlePhotosMulterS3Files,
    articleEntity: ArticleEntity,
  ): PhotoEntity[] {
    const poster = files['poster']?.pop() as MulterS3File;
    const pictures: MulterS3File[] = files['pictures']?.map(
      file => file as MulterS3File,
    );
    articleEntity.photos = [];
    if (poster) {
      const photoEntity = this.photoRepo.create(poster);
      photoEntity.type = 'poster';
      articleEntity.photos.push(photoEntity);
    }
    if (pictures?.length) {
      const photoEntities = pictures.map(photo => {
        const photoEntity = this.photoRepo.create(photo);
        photoEntity.type = 'picture';
        return photoEntity;
      });
      articleEntity.photos.push(...photoEntities);
    }
    return articleEntity.photos;
  }
  private initTaglistEntity(data: Partial<CreateArticleDTO>) {
    return Promise.all(
      data.tagList.map(async tag => {
        const existedTag = await this.tagRepo.findOne({
          where: { title: tag },
        });
        if (existedTag) {
          return existedTag;
        } else {
          return this.tagRepo.create({ title: tag });
        }
      }),
    );
  }
}
