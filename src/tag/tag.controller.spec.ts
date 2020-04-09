import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { TagService } from './tag.service';

describe('Tag Controller', () => {
  let controller: TagController;
  let service: TagService;
  let mockTag: TagEntity = new TagEntity();

  beforeEach(async () => {
    mockTag.title = 'test';
    mockTag.id = 1;
    mockTag.createdAt = new Date(process.env.MOCK_DATE);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        TagService,
        { provide: getRepositoryToken(TagEntity), useClass: Repository },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return call service->findAll once', () => {
      const findAll = jest.spyOn(service, 'findAll');
      controller.find();
      expect(findAll).toBeCalled();
    });
    it('should return an array of tags', () => {
      const findAll = jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([mockTag]));
      const result = controller.find();
      expect(result).resolves.toEqual([mockTag]);
    });
  });
});
