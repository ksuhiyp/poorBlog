import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ update: false, type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: Date })
  updatedAt: Date;
}
