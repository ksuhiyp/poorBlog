import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @Column('')
  @Index({ unique: true })
  tag: string;
}
