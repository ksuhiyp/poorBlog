import {
  Injectable,
  Inject,
  Logger,
  Provider,
  FactoryProvider,
} from '@nestjs/common';
import {
  Connection,
  Repository,
  EntitySchema,
  ConnectionOptions,
} from 'typeorm';
import { InjectConnection, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { ArticleEntity } from 'src/entities/article.entity';
import { TagEntity } from 'src/entities/tag.entity';
import { PhotoEntity } from 'src/entities/photo.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): PostgresConnectionOptions {
    return {
      host: this.configService.get<string>('HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: '',
      database:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? this.configService.get<string>('PROD_DATABASE')
          : this.configService.get<string>('TESTING_DATABASE'),
      entities: [this.configService.get<string>('TYPEORM_ENTITIES')],
      name:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? this.configService.get<string>('DB_CONNECTION_NAME')
          : this.configService.get<string>('TESTING_DB_CONNECTION_NAME'),
      logging:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? true
          : true,
      synchronize:
        this.configService.get<string>('NODE_ENV') === 'testing' ? true : true,
      type: 'postgres',
      logger: 'advanced-console',
    };
  }
}
