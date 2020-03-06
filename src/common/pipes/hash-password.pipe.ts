import { Injectable, PipeTransform, ArgumentMetadata, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { AuthorDto } from "src/author/dto/author.dto";

@Injectable()
export class HashPasswordPipe implements PipeTransform {

    transform(user: AuthorDto, metadata: ArgumentMetadata) {
        const plainPassword = user.password;
        const saltRounds = 10;
        const hash = bcrypt.hashSync(plainPassword, saltRounds)
        user.password = hash;
        return user;
    }


}
