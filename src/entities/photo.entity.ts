import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';

@Entity('photos')
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
  )
  article?: ArticleEntity[];
  @Column()
  type: 'picture' | 'poster';
}
