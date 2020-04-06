import { Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity('tags')
export class TagEntity extends AbstractEntity {}
