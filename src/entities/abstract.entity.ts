import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Exclude()
  @CreateDateColumn({ update: false, type: Date })
  createdAt?: Date;
  @Exclude()
  @UpdateDateColumn({ type: Date, insert: false })
  @IsOptional()
  updatedAt?: Date;
}
