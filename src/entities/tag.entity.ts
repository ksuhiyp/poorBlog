import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @Column('')
  @Index({ unique: true })
  title: string;
  @ManyToMany(
    () => ArticleEntity,
    article => article.tagList,
  )
  articles: ArticleEntity[];
}
