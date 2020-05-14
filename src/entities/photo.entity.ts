import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';

@Entity('photo')
export abstract class PhotoEntity extends AbstractEntity {
  @Column()
  bucket: string;
  @Column()
  location: string;
  @Column()
  key: string;
  @Column()
  mimetype: string;
}
