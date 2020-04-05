import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import slugify from 'slugify';
import { IsOptional } from 'class-validator';

@Entity()
export class Article extends AbstractEntity {
  @Column()
  slug?: string;
  @Column()
  title: string;
  @Column()
  body: string;
  @ManyToOne(type => User)
    
    
  author: User;
  @Column({ nullable: true })
  @IsOptional()
  describtion: string;
  // @Column() tag
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
