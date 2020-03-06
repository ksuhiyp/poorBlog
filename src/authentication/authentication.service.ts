import { Injectable } from '@nestjs/common';
import { AuthorService } from 'src/author/author.service';
import { AuthorDto } from 'src/author/dto/author.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthenticationService {
    constructor(private readonly authorService: AuthorService) { }

    async validateUser(username: string, password: string) {
        const author = await this.authorService.findByUsername(username);

        if (author.length && await this.validatePassowrd(password, author.pop())) {
            return author;
        }
        return null;
    }

    private validatePassowrd(password: string, user: AuthorDto): Promise<boolean> {
        return bcrypt.compare(user.password, password);
    }
}
