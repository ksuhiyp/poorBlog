import { Injectable, Logger } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import multers3 from 'multer-s3';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  get S3() {
    return new S3({
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_ACCESS_KEY'),
      logger: Logger,
    });
  }

  get multers3() {
    return multers3({
      s3: this.S3,
      bucket: this.configService.get<string>('BUCKET_NAME'),
      acl: 'public-read',
      key: function(req: any, file, cb) {
        const random = Math.random();
        cb(null, req.body.title + '-' + Math.round(random));
      },
    });
  }
}
