import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { IsUrl, IsOptional } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @IsUrl()
  @IsOptional()
  photo: string;
}
