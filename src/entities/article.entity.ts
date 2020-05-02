import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import slugify from 'slugify';
import { IsOptional } from 'class-validator';
import { PhotoEntity } from './photo.entity';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
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
  describtion: string;
  @Column('simple-array')
  @IsOptional()
  tagList: string[];
  @OneToMany(
    type => PhotoEntity,
    photo => photo.article,
  )
  photos: PhotoEntity[];
  @OneToOne(
    type => PhotoEntity,
    photo => photo.article,
  )
  photo: PhotoEntity;
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
}
