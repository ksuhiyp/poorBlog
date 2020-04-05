import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity()
export class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ update: false, type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: Date })
  @IsOptional()
  updatedAt?: Date;
}
