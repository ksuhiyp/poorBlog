import { Repository, InsertResult } from "typeorm";
import { Author } from "src/author/author.entity";

export class MockAuthorRepository extends Repository<Author> {
    readonly author: Author = { username: 'test', password: 'test' };
    constructor() {
        super();

    }

    find() {
        return Promise.resolve([this.author])
    }
    findOne() {
        return Promise.resolve(this.author)
    }
    findOneOrFail() {
        return Promise.resolve(this.author)

    }
    insert(): Promise<InsertResult> {
        return Promise.resolve({ generatedMaps: [{}], raw: '', identifiers: [{}] })
    }
   
}