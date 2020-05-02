import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';

@Entity()
export class PhotoEntity extends AbstractEntity {
  @Column()
  bucket: string;
  @Column()
  location: string;
  @Column()
  key: string;
  @ManyToOne(
    type => ArticleEntity,
    article => article.photos,
    { cascade: true },
  )
  @OneToOne(
    type => ArticleEntity,
    article => article.photo,
    { cascade: true },
  )
  article?: ArticleEntity;
  @Column()
  type: 'article' | 'main';
}
