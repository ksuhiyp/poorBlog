import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()

export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column({ unique: true })
    username: string;


}