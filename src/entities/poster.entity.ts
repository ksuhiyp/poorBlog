import { Entity, OneToOne } from 'typeorm';
import { PhotoEntity } from './photo.entity';
import { ArticleEntity } from './article.entity';

@Entity('poster')
export class PosterEntity extends PhotoEntity {
  @OneToOne(
    () => ArticleEntity,
    article => article.poster,{onDelete:'CASCADE'}
  )
  article: ArticleEntity;
}
