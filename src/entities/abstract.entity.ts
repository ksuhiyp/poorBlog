import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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
  @UpdateDateColumn({ type: Date })
  @IsOptional()
  updatedAt?: Date;
}
