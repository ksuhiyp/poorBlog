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
import { Article } from './article.entity';

@Entity()
export class User extends AbstractEntity {
  constructor() {
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
    type => Article,
    article => article.id,
  )
  articles?: Article[];

   toJson?(): UserResponseDTO {
    return <UserResponseDTO>classToPlain(this);
  }

 
}
