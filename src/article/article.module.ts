import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { TagEntity } from '../entities/tag.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AwsService } from 'src/common/services/aws.service';
import { PosterEntity } from 'src/entities/poster.entity';
import { ImageEntity } from 'src/entities/image.entity';
import { MulterS3Service } from 'src/common/services/multer-s3/multer-s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, TagEntity, PosterEntity, ImageEntity]),
    MulterModule.registerAsync({
      useClass: MulterS3Service,
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, AwsService],
})
export class ArticleModule {}
