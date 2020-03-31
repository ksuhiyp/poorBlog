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

@Entity()
export class Article extends AbstractEntity {
  @Column()
  slug: string;
  @Column()
  title: string;
  @Column()
  body: string;
  @ManyToOne(type => User)
  author: string;
  @Column()
  describtion: string;
  // @Column() tag
  // @Column() comments
  // @Column() description
  // @Column()
  @BeforeInsert()
  @BeforeUpdate()
  private titleToSlug(): string {
    return (
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
