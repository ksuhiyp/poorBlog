import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TagEntity } from '../entities/tag.entity';

describe('ArticleService', () => {
  let service: ArticleService;
  let repo: Repository<ArticleEntity>;
  let mockAuthor: Omit<UserEntity, 'password' | 'createdAt' | 'updatedAT'> = {
    id: 1,
    username: 'test',
    bio: null,
    articles: [],
    photo: null,
    toJson: (() => this).bind(this),
  };
  let mockArticle: CreateArticle = {
    author: mockAuthor,
    createdAt: new Date(process.env.MOCK_DATE),
    body: 'test',
    description: 'test',
    title: 'test',
    tagList: [],
    toJson: (() => this).bind(this),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: getRepositoryToken(ArticleEntity), useClass: Repository },
        { provide: getRepositoryToken(TagEntity), useClass: Repository },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repo = module.get(getRepositoryToken(ArticleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getArticle', () => {
    it('should call repo->findOneOrFail with args one time', () => {
      const findOne = jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => Promise.resolve(mockArticle));
      const result = service.getArticle({ id: 1 });
      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith({
        where: { id: 1 },
        relations: ['author'],
      });
    });
    it('should return an article', () => {
      const getArticle = jest.spyOn(service, 'getArticle').mockImplementation(() => Promise.resolve(mockArticle));
      const result = service.getArticle({ id: 1 });
      return expect(service.getArticle({ id: 1 })).resolves.toEqual(mockArticle);
    });
  });
  describe('getArticles', () => {
    it('should call repo one time ', () => {
      const find = jest.spyOn(repo, 'find').mockImplementation(() => Promise.resolve([mockArticle]));
      const result = service.getArticles();
      expect(find).toBeCalledTimes(1);
    });

    it('should return articles', () => {
      const getArticles = jest.spyOn(service, 'getArticles').mockImplementation(() => Promise.resolve([mockArticle]));
      const result = service.getArticles({ take: 2, skip: 0 });
      expect(result).resolves.toEqual([mockArticle]);
    });
  });
  describe('createArticle', () => {
    it('should call repo create then save one time with args', () => {
      const create = jest.spyOn(repo, 'create').mockImplementation(() => mockArticle);
      const save = jest.spyOn(repo, 'save').mockImplementation(() => Promise.resolve(mockArticle));
      const result = service.createArticle(mockArticle, mockAuthor, null);
      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(mockArticle);
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith(mockArticle);
    });
    it('should return an article', () => {
      const create = jest.spyOn(repo, 'create').mockImplementation(() => mockArticle);
      const save = jest.spyOn(repo, 'save').mockImplementation(() => Promise.resolve(mockArticle));
      const result = service.createArticle(mockArticle, mockAuthor);
      return expect(result).resolves.toEqual(mockArticle);
    });
  });
  describe('updateArticle', () => {
    it('should call repo->findOne', () => {
      const findOne = jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => Promise.resolve(mockArticle));
      const result = service.updateArticle(1, { body: 'test' }, mockAuthor);
      expect(findOne).toBeCalled();
      expect(findOne).toBeCalledWith(1, { relations: ['author'] });
    });
    it('should throw if user updating an article which is not owned by him', () => {
      jest.spyOn(repo, 'findOne').mockImplementation(() => Promise.resolve(mockArticle));
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve({ affected: 0, raw: '', generatedMaps: [] }));
      const result = service.updateArticle(
        1,
        { body: 'test' },
        {
          id: 2,
          username: 'suhaib',
        },
      );
      return expect(result).rejects.toThrowError(ForbiddenException);
    });
    it('should return updated results', () => {
      jest.spyOn(repo, 'findOne').mockImplementation(() => Promise.resolve(mockArticle));
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve({ affected: 0, raw: '', generatedMaps: [] }));
      const result = service.updateArticle(1, { body: 'test' }, mockAuthor);
      expect(result).resolves.toEqual({
        affected: 0,
        generatedMaps: [],
        raw: '',
      });
    });
  });
  describe('delete article', () => {
    it('should throw if article not found', () => {
      jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => Promise.reject(new Error()));
      const result = service.deleteArticle(1, mockAuthor);
      return expect(result).rejects.toThrow(Error);
    });
    it('should call findOneOrFail with id arg', () => {
      const findOneOrFail = jest.spyOn(repo, 'findOneOrFail');
      service.deleteArticle(1, mockAuthor);
      expect(findOneOrFail).toBeCalledWith(1, { relations: ['author'] });
    });
    it("should throw if user dosn't own the article", () => {
      jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => Promise.resolve(mockArticle));

      const result = service.deleteArticle(1, {
        id: 2,
        username: 'test',
      });
      return expect(result).rejects.toThrowError(ForbiddenException);
    });
    it('should return delete result', () => {
      jest.spyOn(repo, 'findOneOrFail').mockImplementation(() => Promise.resolve(mockArticle));
      jest.spyOn(repo, 'delete').mockImplementation(() => Promise.resolve({ raw: '', affected: 1 }));
      const result = service.deleteArticle(1, mockAuthor);
      return expect(result).resolves.toEqual({
        affected: 1,
        raw: '',
      });
    });
  });
});
