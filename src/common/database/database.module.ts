import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { UserEntity } from '../../entities/user.entity';
import { ArticleEntity } from '../../entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: '',
      database:
        process.env.NODE_ENV === 'production'
          ? process.env.PROD_DATABASE
          : process.env.TESTING_DATABASE,
      entities: [UserEntity, ArticleEntity],
      name:
        process.env.NODE_ENV === 'production'
          ? process.env.DB_CONNECTION_NAME
          : process.env.TESTING_DB_CONNECTION_NAME,
      keepConnectionAlive: true,
      synchronize: process.env.NODE_ENV === 'testing' ? true : true,
      logging: process.env.NODE_ENV === 'development' ? true : false,
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
