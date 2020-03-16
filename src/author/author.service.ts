import { Injectable, HttpException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository, InsertResult, DeleteResult, UpdateResult } from 'typeorm';
import { AuthorDto } from './dto/author.dto';
@Injectable()
export class AuthorService {
    constructor(@InjectRepository(Author) private readonly authorRepository: Repository<Author>) { }

    findByUsername(username: string): Promise<Author[]> {
        return this.authorRepository.find({ where: { username } });

    }
    findById(id: number): Promise<Author> {
        return this.authorRepository.findOne(id);
    }
    findOne(id: number): Promise<Author> {
        return this.authorRepository.findOneOrFail(id);
    }

    findAll(): Promise<Author[]> {
        return this.authorRepository.find();
    }
    create(author: AuthorDto): Promise<InsertResult> {
        const _author = this.authorRepository.create(author);
        return this.authorRepository.insert(author);
    }

    async update(id, author: AuthorDto): Promise<UpdateResult> {
        return this.authorRepository.update({ id }, author);

    }
    async delete(id: number): Promise<DeleteResult> {
     
        return this.authorRepository.delete(id);
    }
}
