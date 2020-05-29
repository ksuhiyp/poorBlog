import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TagEntity } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TagService', () => {
  let service: TagService;
  const mockTag: TagEntity = new TagEntity();
  beforeAll(async () => {
    mockTag.title = 'test';
    mockTag.id = 1;
    mockTag.createdAt = new Date(process.env.MOCK_DATE);
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagService, { provide: getRepositoryToken(TagEntity), useClass: Repository }],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should return array of tags', async () => {
      const findAll = jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve([mockTag]));
      const result = service.findAll();
      expect(findAll).toBeCalled();
      return expect(result).resolves.toEqual([mockTag]);
    });
  });
});
