import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import slugify from 'slugify';
import { IsOptional } from 'class-validator';
import { PhotoEntity } from './photo.entity';
import { TagEntity } from './tag.entity';

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
  description: string;

  @IsOptional()
  @ManyToMany(
    type => TagEntity,
    tag => tag.articles,
    { cascade: true },
  )
  @JoinTable()
  tagList: TagEntity[];
  @OneToMany(
    type => PhotoEntity,
    photo => photo.article,
    { cascade: true, eager: true },
  )
  @JoinColumn()
  photos?: PhotoEntity[];
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
