import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository, EntitySchema } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() public connection: Connection) {}

  async getRepositry<T>(entity: EntitySchema): Promise<Repository<T>> {
    return this.connection.getRepository(entity);
  }
}
