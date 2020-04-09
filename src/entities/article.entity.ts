import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import slugify from 'slugify';
import { IsOptional } from 'class-validator';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug?: string;
  @Column()
  title: string;
  @Column()
  body: string;
  @ManyToOne(type => UserEntity)
  author: UserEntity;
  @Column({ nullable: true })
  @IsOptional()
  describtion: string;
  @Column('simple-array')
  tagList: string[];
  // @Column() comments
  // @Column() description
  // @Column()
  @BeforeInsert()
  titleToSlug?(): void {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
}
