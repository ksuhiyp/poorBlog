import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import multers3 from 'multer-s3';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
@Injectable()
export class AwsService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}
  get S3() {
    return new S3({
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_ACCESS_KEY'),
      logger: Logger,
    });
  }

  createMulterOptions(): MulterOptions {
    return {
      storage: multers3({
        s3: this.S3,
        bucket: this.configService.get<string>('BUCKET_NAME'),
        acl: 'public-read',
        key: function(req: any, file, cb) {
          const random = Math.random();
          cb(
            null,
            `${file.filename}-${(
              (Math.random() * Math.pow(36, 6)) |
              0
            ).toString(36)}`,
          );
        },
        contentType: function(req: any, file, cb) {
          cb(null, file.mimetype);
        },
      }),
      fileFilter: (req, file, cb) => this.filterFileExtension(req, file, cb),
    };
  }

  private filterFileExtension(req, file, cb) {
    if (file.mimetype.split('/').shift() === 'image') {
      return cb(null, true);
    }
    return cb(
      new HttpException('Unsupported Extension', HttpStatus.NOT_ACCEPTABLE),
      false,
    );
  }

  deleteObject(Bucket: string, Key: string): Promise<S3.DeleteObjectOutput> {
    return this.S3.deleteObject({ Bucket, Key }).promise();
  }
}
