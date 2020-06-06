import { Injectable, ForbiddenException, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Repository, DeleteResult } from 'typeorm';
import { GetArticleByIdOrSlugQuery, GetArticlesQuery, DeleteArticleImageDTO } from 'src/models/article.model';
import { UserEntity } from 'src/entities/user.entity';
import { TagEntity } from '../entities/tag.entity';
import { UserRequestDTO } from 'src/models/user.model';
import { PosterEntity } from 'src/entities/poster.entity';
import { plainToClass } from 'class-transformer';
import { AwsService } from 'src/common/services/aws.service';
import { ImageEntity } from 'src/entities/image.entity';
import { constants } from 'buffer';
import { constatns } from 'src/common/constants';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private repo: Repository<ArticleEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
    @InjectRepository(PosterEntity)
    private posterRepo: Repository<PosterEntity>,
    @InjectRepository(ImageEntity)
    private imageRepo: Repository<ImageEntity>,
    private aws: AwsService,
  ) {}
  getArticle(slugOrId?: string | number): Promise<ArticleEntity> {
    return this.repo.findOneOrFail({
      where: [{ id: isNaN(parseInt(slugOrId.toString())) ? undefined : slugOrId }, { slug: slugOrId }],
      relations: ['author', 'tags', 'poster'],
    });
  }
  getArticles(query?: GetArticlesQuery): Promise<ArticleEntity[]> {
    return this.repo.find({ ...query, relations: ['author', 'poster', 'tags'] });
  }
  async createArticle(drafteArticle: Partial<ArticleEntity>, author: UserEntity): Promise<ArticleEntity> {
    const articleDraftEntity = this.repo.create(drafteArticle);
    articleDraftEntity.author = author;
    return this.repo.save(articleDraftEntity);
  }
  async updateArticle(id: number, newArticle: Partial<ArticleEntity>, user: Partial<UserEntity>): Promise<ArticleEntity> {
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

    const posterEntity = this.posterRepo.create(plainToClass(PosterEntity, poster));
    posterEntity.bucket = poster.Bucket;
    posterEntity.location = poster.Location;
    posterEntity.key = poster.Key;
    

    if (article.poster) {
      await this.aws.deleteObject(constatns.bucket, article.poster.key);
      await this.posterRepo.delete(article.poster.id);
    }

    article.poster = posterEntity;
    return this.repo.save(article);
  }

  async patchArticleImages(articleId: number, image: MulterS3File): Promise<MulterS3File> {
    const article = await this.repo.findOneOrFail(articleId);
    const imageEntity = this.imageRepo.create(image);
    article.images.push(imageEntity);
    await this.repo.save(article);
    return image;
  }

  async deleteArticleImage(articleId: number, body: DeleteArticleImageDTO) {
    const imagesToDelete = body.imagesToDelete;
    await this.imageRepo.delete(imagesToDelete.map(image => image.id));
    return this.repo.findOne(articleId);
  }

  async deleteArticle(id: number, user: UserRequestDTO): Promise<DeleteResult> {
    const article = await this.repo.findOneOrFail(id, {
      relations: ['author'],
    });
    if (!article.isArticleAuthor(user)) {
      throw new ForbiddenException(`User ${user.username} doesn\'t own article ${article.slug}`);
    }
    return this.repo.delete(id);
  }

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
