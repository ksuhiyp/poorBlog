import { Injectable, Logger } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import { ImageEntity } from 'src/entities/image.entity';
@Injectable()
export class AwsService  {
  constructor(private configService: ConfigService) {}
  get S3() {
    return new S3({
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_ACCESS_KEY'),
      logger: Logger,
    });
  }

  

  deleteObject(Bucket: string, Key: string): Promise<S3.DeleteObjectOutput> {
    return this.S3.deleteObject({ Bucket, Key }).promise();
  }
  deleteObjects(Bucket: string, images: ImageEntity[]): Promise<S3.DeleteObjectOutput> {
    const objectsToDelete: S3.ObjectIdentifier[] = images.map(image => ({ Key: image.key }));
    const params: S3.DeleteObjectsRequest = { Bucket, Delete: { Objects: objectsToDelete } };
    return this.S3.deleteObjects(params).promise();
  }
}
