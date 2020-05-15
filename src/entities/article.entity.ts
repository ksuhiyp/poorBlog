import { Entity, Column, ManyToOne, BeforeInsert, OneToMany, OneToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import slugify from 'slugify';
import { IsOptional, IsArray } from 'class-validator';
import { PhotoEntity } from './photo.entity';
import { TagEntity } from './tag.entity';
import { UserRequestDTO } from 'src/models/user.model';
import { Bool } from 'aws-sdk/clients/clouddirectory';
import { Type } from 'class-transformer';
import { ImageEntity } from './image.entity';
import { PosterEntity } from './poster.entity';

@Entity('article')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug?: string;

  @Column({ type: 'boolean', default: 'true' })
  isDraft: boolean;

  @Column()
  title: string;

  @Column({ nullable: true, default: null })
  body?: string;

  @ManyToOne(type => UserEntity)
  @Type(() => UserEntity)
  author: Partial<UserEntity>;

  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  @Type(() => TagEntity)
  @ManyToMany(
    () => TagEntity,
    tag => tag.articles,
    { cascade: true },
  )
  @JoinTable()
  tags: TagEntity[];

  @OneToMany(
    type => ImageEntity,
    image => image.article,
    { cascade: true, eager: true },
  )
  @JoinColumn()
  images?: ImageEntity[];
  @OneToOne(
    () => PosterEntity,
    poster => poster.article,
    { cascade: true },
  )
  @JoinColumn()
  poster: PosterEntity;

  @BeforeInsert()
  titleToSlug?(): void {
    this.slug = slugify(this.title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  isArticleAuthor?(attempter: Partial<UserEntity>): Boolean {
    return attempter.id === this.author.id;
  }

  toJson?() {
    const article = this;
    article.author = article.author.toJson();
    return article;
  }
}
