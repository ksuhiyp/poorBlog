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
import { plainToClass, deserializeArray } from 'class-transformer';
import { deserialize } from 'v8';
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
    drafteArticle: ArticleEntity,
    author: UserEntity,
  ): Promise<ArticleEntity> {
    const articleDraftEntity = this.repo.create(drafteArticle);
    articleDraftEntity.author = author;
    return this.repo.save(articleDraftEntity);
    // const articleEntity = await this.initArticleEntity(data, author, files);
    // articleEntity.photos = this.initArticlePhotos(files, articleEntity);
    // articleEntity.tagList = await this.initTaglistEntities(data);

    // await this.tagRepo
    //   .createQueryBuilder()
    //   .insert()
    //   .into(TagEntity)
    //   .values(articleEntity.tagList)
    //   .orIgnore()
    //   .execute();
    // const article = await this.repo.save(articleEntity);
    // return article;
  }
  async updateArticle(
    id: number,
    data: Partial<ArticleEntity>,
    user: UserRequestDTO,
    files: ArticlePhotosMulterS3Files,
  ): Promise<UpdateResult> {
    const article = await this.repo.findOneOrFail(id, {
      relations: ['author'],
    });
    if (!article.isArticleAuthor(user)) {
      throw new ForbiddenException("You don't own the article");
    }
    return this.repo.update({ id }, data);
  }
  async deleteArticle(id: number, user: UserRequestDTO): Promise<DeleteResult> {
    const article = await this.repo.findOneOrFail(id, {
      relations: ['author'],
    });
    if (!article.isArticleAuthor(user)) {
      throw new ForbiddenException(
        `User ${user.username} doesn\'t own article ${article.slug}`,
      );
    }
    return this.repo.delete(id);
  }

  // private async initArticleEntity(
  //   data: Partial<CreateArticleDTO>,
  //   author: UserRequestDTO,
  //   files: ArticlePhotosMulterS3Files,
  // ): Promise<ArticleEntity> {
  //   const articleEntity = new ArticleEntity();
  //   articleEntity.title = data.title;
  //   articleEntity.body = data.body;
  //   articleEntity.description = data.description;
  //   articleEntity.author = author;

  //   return articleEntity;
  // }

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
  private initTaglistEntities(data: Partial<CreateArticleDTO>) {
    // return Promise.all(
    //   data.tagList.map(async tag => {
    //     const existedTag = await this.tagRepo.findOne({
    //       where: { title: tag },
    //     });
    //     if (existedTag) {
    //       return existedTag;
    //     } else {
    //       return this.tagRepo.create({ title: tag });
    //     }
    //   }),
    // );
    // const tagEntities = data.tagList.map(tag =>
    // deserializeArray(TagEntity, data.tagList),
    // );
    // return tagEntities;
  }
}
