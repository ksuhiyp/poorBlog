import { Entity, ManyToOne, Column, BeforeRemove } from 'typeorm';
import { PhotoEntity } from './photo.entity';
import { ArticleEntity } from './article.entity';
import { S3 } from 'aws-sdk';

@Entity('image')
export class ImageEntity extends PhotoEntity {
  private get S3() {
    return new S3({
      accessKeyId: process.env['S3_ACCESS_KEY_ID'],
      secretAccessKey: process.env['S3_ACCESS_KEY'],
    });
  }
  @ManyToOne(
    type => ArticleEntity,
    article => article.images,
  )
  article?: ArticleEntity[];

  @BeforeRemove()
  deleteS3Object() {
    const params: S3.DeleteObjectRequest = { Bucket: this.bucket, Key: this.key };
    this.S3.deleteObject(params, (err, data) => {
      if (err) throw err;
    });
  }
}
