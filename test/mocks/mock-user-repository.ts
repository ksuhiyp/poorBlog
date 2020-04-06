import { Repository, InsertResult } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

export class MockUserRepository extends Repository<UserEntity> {
  readonly user: UserEntity = {
    id: 1,
    username: 'test',
    toJson: () => undefined,
    updatedAt: new Date(),
    createdAt: new Date(),
    password: 'test',
    photo: null,
    bio: null,
    articles: [],
  };
  constructor() {
    super();
  }

  find() {
    return Promise.resolve([this.user]);
  }
  findOne() {
    return Promise.resolve(this.user);
  }
  findOneOrFail() {
    return Promise.resolve(this.user);
  }
  insert(): Promise<InsertResult> {
    return Promise.resolve({ generatedMaps: [{}], raw: '', identifiers: [{}] });
  }
}
