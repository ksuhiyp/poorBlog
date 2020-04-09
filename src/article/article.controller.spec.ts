import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { AuthGuard } from '@nestjs/passport';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import {
  GetArticlesQuery,
  CreateArticleDTO,
  UpdateArticleDTO,
} from 'src/models/article.model';

describe('Article Controller', () => {
  let controller: ArticleController;
  let service: ArticleService;
  let mockAricle: any = {
    author: 1,
    title: 'test',
    description: 'test',
    body: 'test',
  };
  let getArticlesQuery: GetArticlesQuery = {
    order: undefined,
    skip: undefined,
    take: undefined,
    where: undefined,
  };
  let createArticleBody: CreateArticleDTO = {
    body: 'test',
    describtion: 'test',
    title: 'test',
  };
  let updateArticleBody: UpdateArticleDTO = {
    body: 'test',
  };
  let user: any = { username: 'suhayb', id: 1 };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        ArticleService,
        { provide: getRepositoryToken(ArticleEntity), useClass: Repository },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('service should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET article/:id', () => {
    it('should be called with id param', () => {
      jest.spyOn(controller, 'article');
      const result = controller.article(1);
      return expect(controller.article).toBeCalledWith(1);
    });
    it('should call getArticle one times with id argument', () => {
      jest.spyOn(controller, 'article');
      jest.spyOn(service, 'getArticle').mockImplementation(() => mockAricle);
      controller.article(1);
      expect(service.getArticle).toBeCalledTimes(1);
      return expect(service.getArticle).toBeCalledWith({ id: 1 });
    });
    it('service should return article if data found', () => {
      jest.spyOn(controller, 'article');
      jest.spyOn(service, 'getArticle').mockImplementation(() => mockAricle);
      const result = controller.article(1);
      return expect(result).resolves.toEqual(mockAricle);
    });
    it('service should return NotFoundException if data not found', () => {
      jest.spyOn(controller, 'article');
      jest.spyOn(service, 'getArticle').mockRejectedValue(() => {
        throw new NotFoundException();
      });
      const result = controller.article(1);
      return expect(result).rejects.toThrowError(NotFoundException);
    });
  });
  describe('Get articles', () => {
    it('should be called one time and with get articles query', () => {
      const articles = jest.spyOn(controller, 'articles');
      const getArticles = jest
        .spyOn(service, 'getArticles')
        .mockImplementation(() => Promise.resolve([mockAricle]));
      const result = controller.articles(getArticlesQuery);
      expect(articles).toBeCalledTimes(1);
      return expect(articles).toBeCalledWith(getArticlesQuery);
    });
    it('should call service->getArticles with query args one times ', () => {
      const articles = jest.spyOn(controller, 'articles');
      const getArticles = jest
        .spyOn(service, 'getArticles')
        .mockImplementation(() => Promise.resolve([mockAricle]));
      const result = controller.articles(getArticlesQuery);
      expect(getArticles).toBeCalledTimes(2);
      expect(getArticles).toBeCalledWith(getArticlesQuery);
    });

    it('should return articles', () => {
      const articles = jest.spyOn(controller, 'articles');
      const getArticles = jest
        .spyOn(service, 'getArticles')
        .mockImplementation(() => Promise.resolve([mockAricle]));
      const result = controller.articles(getArticlesQuery);
      return expect(result).resolves.toEqual([mockAricle]);
    });
  });
  describe('Post article', () => {
    it('should call service->createArticle once with args', () => {
      const articles = jest.spyOn(controller, 'createArticle');
      const createArticle = jest
        .spyOn(service, 'createArticle')
        .mockImplementation(() => Promise.resolve(mockAricle));
      const result = controller.createArticle(createArticleBody, user);
    });
    it('should return an article', () => {
      const articles = jest.spyOn(controller, 'createArticle');
      const createArticle = jest
        .spyOn(service, 'createArticle')
        .mockImplementation(() => Promise.resolve(mockAricle));
      const result = controller.createArticle(createArticleBody, user);
      return expect(result).resolves.toEqual(mockAricle);
    });
  });
  describe('Put article', () => {
    it('should call service->updateArtice with args', () => {
      const articles = jest.spyOn(controller, 'updateArticle');
      const updateArticle = jest
        .spyOn(service, 'updateArticle')
        .mockImplementation(() => Promise.resolve(mockAricle));
      const result = controller.updateArticle(createArticleBody, user, 1);
      expect(updateArticle).toBeCalledTimes(1);
      // expect(updateArticle).toBeCalledWith(updateArticleBody, user, 1);
    });
    it('should return article', () => {
      const articles = jest.spyOn(controller, 'updateArticle');
      const updateArticle = jest
        .spyOn(service, 'updateArticle')
        .mockImplementation(() => Promise.resolve(mockAricle));
      const result = controller.updateArticle(createArticleBody, user, 1);
      return expect(result).resolves.toEqual(mockAricle);
    });
  });
  describe('Delete article', () => {
    it('should call service->delete', () => {
      const articles = jest.spyOn(controller, 'updateArticle');
      const deleteArticle = jest
        .spyOn(service, 'deleteArticle')
        .mockImplementation(() =>
          Promise.resolve<DeleteResult>({ raw: '', affected: 1 }),
        );
      const result = controller.deleteArticle(1, user);
      expect(deleteArticle).toBeCalledTimes(1);
      expect(deleteArticle).toBeCalledWith(1, user);
    });
    it('should return deleteresult', () => {
      const articles = jest.spyOn(controller, 'updateArticle');
      const deleteArticle = jest
        .spyOn(service, 'deleteArticle')
        .mockImplementation(() =>
          Promise.resolve<DeleteResult>({ raw: '', affected: 1 }),
        );
      const result = controller.deleteArticle(1, user);
      return expect(result).resolves.toEqual({ raw: '', affected: 1 });
    });
  });
});
