import { Module } from '@nestjs/common';
import { AwsService } from './services/aws.service';
import { MulterS3Service } from './services/multer-s3/multer-s3.service';

@Module({ providers: [AwsService, MulterS3Service], exports: [AwsService] })
export class CommonModule {}
