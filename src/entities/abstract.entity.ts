import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  @IsOptional()
  updatedAt?: Date;
}
