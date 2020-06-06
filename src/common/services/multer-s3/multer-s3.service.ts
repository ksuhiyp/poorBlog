import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import multers3 from 'multer-sharp-s3';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MulterOptionsFactory } from '@nestjs/platform-express';

@Injectable()
export class MulterS3Service implements MulterOptionsFactory {
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
        Bucket: this.configService.get<string>('BUCKET_NAME'),
        ACL: 'public-read',
        Key: function(req: any, file, cb) {
          const random = Math.random();
          const pow = Math.pow(36, 6);
          cb(null, `${file.originalname}-${((random * pow) | 0).toString(36)}`);
        },
        resize: { height: null, width: 640, options: { fill: 'contain' } },

        toFormat: { type: 'webp' },
      }),
      fileFilter: (req, file, cb) => this.filterFileExtension(req, file, cb),
    };
  }

  private filterFileExtension(req, file, cb) {
    if (file.mimetype.split('/').shift() === 'image') {
      return cb(null, true);
    }
    return cb(new HttpException('Unsupported Extension', HttpStatus.NOT_ACCEPTABLE), false);
  }
}
