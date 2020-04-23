import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { IsUrl, IsOptional } from 'class-validator';
import { AbstractEntity } from './abstract.entity';
import { Exclude, classToPlain } from 'class-transformer';
import { UserResponseDTO } from 'src/models/user.model';
import { ArticleEntity } from './article.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  constructor(user: Partial<UserEntity>) {
    super();
  }
  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: null, nullable: true })
  @IsUrl()
  @IsOptional()
  photo?: string;

  @Column({ default: null, nullable: true })
  bio?: string;

  @OneToMany(
    type => ArticleEntity,
    article => article.id,
  )
  articles?: ArticleEntity[];

  toJson?(): Omit<UserEntity, 'password' | 'createdAt' | 'updatedAt'> {
    return <UserEntity>classToPlain(this);
  }
}
