import { Test, TestingModule } from '@nestjs/testing';
import { MulterS3Service } from './multer-s3.service';

describe('MulterS3Service', () => {
  let service: MulterS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MulterS3Service],
    }).compile();

    service = module.get<MulterS3Service>(MulterS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
