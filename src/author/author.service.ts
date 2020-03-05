import { Injectable, HttpException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository, InsertResult, DeleteResult } from 'typeorm';
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
    private findOne(id: number): Promise<Author> {
        return this.authorRepository.findOneOrFail(id);
    }

    findAll(): Promise<Author[]> {
        return this.authorRepository.find();
    }
    create(author: AuthorDto): Promise<InsertResult> {
        const _author = this.authorRepository.create(author);
        return this.authorRepository.insert(author);
    }

    async update(id, author: AuthorDto): Promise<AuthorDto> {
        const oldAuthor = await this.findOne(id);
        this.authorRepository.update({ id }, author);
        return oldAuthor;
    }
    async delete(id: number): Promise<DeleteResult> {
        const author = await this.findById(id);
        if (!author) {
            throw new BadRequestException(`Author with id of ${id} was not found`)
        }
        return this.authorRepository.delete(author.id);
    }
}
