import { Repository, InsertResult } from "typeorm";
import { User } from "src/entities/user.entity";

export class MockUserRepository extends Repository<User> {
    readonly user: User = { username: 'test', password: 'test' };
    constructor() {
        super();

    }

    find() {
        return Promise.resolve([this.user])
    }
    findOne() {
        return Promise.resolve(this.user)
    }
    findOneOrFail() {
        return Promise.resolve(this.user)

    }
    insert(): Promise<InsertResult> {
        return Promise.resolve({ generatedMaps: [{}], raw: '', identifiers: [{}] })
    }
   
}