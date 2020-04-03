import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';

describe('ArticleService', () => {
  let service: ArticleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: getRepositoryToken(Article), useClass: Repository },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
