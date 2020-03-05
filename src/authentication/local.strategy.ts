import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { AuthenticationService } from "./authentication.service";
import { PassportStrategy } from '@nestjs/passport'
import { AuthorDto } from "src/author/dto/author.dto";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authenticationService: AuthenticationService) {
        super();
    }

    async validate(username: string, password: string) {
        const author = await this.authenticationService.validateUser(username, password);

        if (!author) {
            throw new UnauthorizedException();
        }
        return author;
    }
} 