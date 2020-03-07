import { Injectable } from '@nestjs/common';
import { AuthorService } from 'src/author/author.service';
import { AuthorDto } from 'src/author/dto/author.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthenticationService {
    constructor(private readonly authorService: AuthorService) { }

    async validateUser(username: string, password: string) {
        const author = await this.authorService.findByUsername(username);

        if (author.length && this.validatePassowrd(password, author[0].password)) {
            return author;
        }
        return null;
    }

    private validatePassowrd(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}
