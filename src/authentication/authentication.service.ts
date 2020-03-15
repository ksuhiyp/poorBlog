import { Injectable } from '@nestjs/common';
import { AuthorService } from '../author/author.service';
import * as bcrypt from 'bcrypt'
import { Author } from 'src/author/author.entity';
import { JwtService } from '@nestjs/jwt'
import { AuthorDto } from 'src/author/dto/author.dto';
@Injectable()
export class AuthenticationService {
    constructor(private readonly authorService: AuthorService, private readonly jwtService: JwtService) { }

    async validateUser(username: string, password: string) {
        const author = await this.authorService.findByUsername(username);

        if (author.length && this.validatePassowrd(password, author[0].password)) {
            delete author[0].password;
            return author;
        }
        return null;
    }

    private validatePassowrd(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

    login(author: AuthorDto) {
        const payload = { username: author.username, sub: author.password }
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
