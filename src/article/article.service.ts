import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import {
  Repository,
  UpdateResult,
  DeleteResult,
  InsertResult,
  ConnectionManager,
  getConnection,
} from 'typeorm';
import {
  GetArticleByIdOrSlugQuery,
  GetArticlesQuery,
  UpdateArticleDTO,
  CreateArticleDTO,
} from 'src/models/article.model';
import { UserEntity } from 'src/entities/user.entity';
import { TagEntity } from '../entities/tag.entity';
import { PhotoEntity } from 'src/entities/photo.entity';
import { UserRequestDTO } from 'src/models/user.model';
import { PosterEntity } from 'src/entities/poster.entity';
import { plainToClass } from 'class-transformer';
import { AwsService } from 'src/common/services/aws.service';
import { ImageEntity } from 'src/entities/image.entity';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private repo: Repository<ArticleEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
    @InjectRepository(PosterEntity)
    private posterRepo: Repository<PosterEntity>,
    @InjectRepository(ImageEntity)
    private imageRepo: Repository<ImageEntity>,
    private aws: AwsService,
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
    newArticle: Partial<ArticleEntity>,
    user: Partial<UserEntity>,
  ): Promise<ArticleEntity> {
    const article = await this.repo.findOneOrFail(id, {
      relations: ['author'],
    });
    if (!article.isArticleAuthor(user)) {
      throw new ForbiddenException("You don't own the article");
    }
    const TagEntities = await this.initTaglistEntities(newArticle.tags);
    newArticle.tags = TagEntities;
    newArticle = this.repo.merge(article, newArticle);
    return this.repo.save(newArticle);
  }

  async patchArticlePoster(articleId: number, poster: MulterS3File) {
    const article = await this.repo.findOneOrFail(articleId, {
      relations: ['poster'],
    });

    const posterEntity = this.posterRepo.create(
      plainToClass(PosterEntity, poster),
    );

    if (article.poster) {
      try {
        await this.aws.deleteObject(article.poster.bucket, article.poster.key);
      } catch (error) {
        Logger.warn(error);
      }
    }
    article.poster = posterEntity;

    return this.repo.save(article);
  }

  async patchArticleImages(
    articleId: number,
    image: MulterS3File,
  ): Promise<ArticleEntity> {
    const article = await this.repo.findOneOrFail(articleId);
    const imageEntity = this.imageRepo.create(image);
    article.images.push(imageEntity);
    return this.repo.save(article);
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

  // private initArticlePhotos(
  //   files: ArticlePhotosMulterS3Files,
  //   articleEntity: ArticleEntity,
  // ): PhotoEntity[] {
  //   const poster = files['poster']?.pop() as MulterS3File;
  //   const pictures: MulterS3File[] = files['pictures']?.map(
  //     file => file as MulterS3File,
  //   );
  //   articleEntity.photos = [];
  //   if (poster) {
  //     const photoEntity = this.photoRepo.create(poster);
  //     photoEntity.type = 'poster';
  //     articleEntity.photos.push(photoEntity);
  //   }
  //   if (pictures?.length) {
  //     const photoEntities = pictures.map(photo => {
  //       const photoEntity = this.photoRepo.create(photo);
  //       photoEntity.type = 'picture';
  //       return photoEntity;
  //     });
  //     articleEntity.photos.push(...photoEntities);
  //   }
  //   return articleEntity.photos;
  // }
  private initTaglistEntities(tags: TagEntity[]) {
    return Promise.all(
      tags.map(async tag => {
        const existedTag = await this.tagRepo.findOne({
          where: { title: tag.title },
        });
        if (existedTag) {
          return existedTag;
        } else {
          return this.tagRepo.create(tag);
        }
      }),
    );
  }
}
