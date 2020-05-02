import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { TagEntity } from '../entities/tag.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AwsService } from 'src/common/services/aws.service';
import { CommonModule } from 'src/common/common.module';
import { PhotoEntity } from 'src/entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, TagEntity, PhotoEntity]),
    MulterModule.registerAsync({
      imports: [CommonModule],
      useFactory: (awsService: AwsService) => ({
        storage: awsService.multers3,
      }),
      inject: [AwsService],
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
