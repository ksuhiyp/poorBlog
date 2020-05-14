import { Entity, ManyToOne, Column } from 'typeorm';
import { PhotoEntity } from './photo.entity';
import { ArticleEntity } from './article.entity';

@Entity('image')
export class ImageEntity extends PhotoEntity {
  @ManyToOne(
    type => ArticleEntity,
    article => article.images,
  )
  article?: ArticleEntity[];
}
