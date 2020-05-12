import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  Repository,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import slugify from 'slugify';
import { IsOptional } from 'class-validator';
import { PhotoEntity } from './photo.entity';
import { TagEntity } from './tag.entity';
import { CreateArticleDTO } from 'src/models/article.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequestDTO } from 'src/models/user.model';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  constructor(
    data: CreateArticleDTO,
    author: UserRequestDTO,
    files?: ArticlePhotosMulterS3Files,
    @InjectRepository(TagEntity) private tagRepo?: Repository<TagEntity>,
    @InjectRepository(PhotoEntity) private photoRepo?: Repository<PhotoEntity>,
  ) {
    super();
    this.initArticle(data, author, files);
  }
  @Column()
  slug?: string;
  @Column()
  title: string;
  @Column()
  body: string;
  @ManyToOne(type => UserEntity)
  author: Omit<UserEntity, 'password' | 'createdAt' | 'updatedAt'>;
  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @IsOptional()
  @ManyToMany(
    type => TagEntity,
    tag => tag.articles,
  )
  @JoinTable()
  tagList: TagEntity[];
  @OneToMany(
    type => PhotoEntity,
    photo => photo.article,
    { cascade: true },
  )
  photos?: PhotoEntity[];
  @OneToOne(
    type => PhotoEntity,
    photo => photo.article,
    { cascade: true },
  )
  photo?: PhotoEntity;
  @BeforeInsert()
  titleToSlug?(): void {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  toJson?() {
    const article = this;
    article.author = article.author.toJson();
    return article;
  }

  private initArticle(
    data: CreateArticleDTO,
    author,
    files: ArticlePhotosMulterS3Files,
  ) {
    this.title = data.title;
    this.body = data.body;
    this.description = data.description;
    this.tagList = data.tagList.map(tag => this.tagRepo.create({ title: tag }));
    this.photo = this.photoRepo.create(files.photo.pop());
    this.photo.type = 'main';
    this.photos = files.photos.map(photo => {
      const photoEntity = this.photoRepo.create(photo);
      photoEntity.type = 'article';
      return photoEntity;
    });
    this.author = author;
  }
}
