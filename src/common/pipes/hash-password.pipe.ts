import { Injectable, PipeTransform, ArgumentMetadata, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashPasswordPipe implements PipeTransform {

    transform(plainPassword: string, metadata: ArgumentMetadata) {
        const saltRounds = 10;
        bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
            if (err) {
                throw new InternalServerErrorException(err);
            }
            return hash;
        })

    }
}