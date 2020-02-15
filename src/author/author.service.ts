import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository } from 'typeorm';
import { AuthorDto } from './dto/author.dto';

@Injectable()
export class AuthorService {
    constructor(@InjectRepository(Author) private readonly authorRepository: Repository<Author>) { }

    findOne(username: AuthorDto): Promise<Author> {
        return this.authorRepository.findOneOrFail(username)
    }
}
