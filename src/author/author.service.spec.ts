import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository, UpdateResult } from 'typeorm';
import { MockAuthorRepository } from '../../test/mocks/mock-author-repository';
import { response } from 'express';
import { resolve, resolveSoa } from 'dns';

describe('AuthorService', () => {
  let service: AuthorService;
  let author: Author = { username: 'test', password: 'test' }
  let repo: Repository<Author>;
  let mockRepository: Repository<Author> = new MockAuthorRepository
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorService, { provide: getRepositoryToken(Author), useValue: mockRepository }],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repo = module.get<MockAuthorRepository>(getRepositoryToken(Author))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return an array of author', () => {
      jest.spyOn(service, 'findByUsername')
      const find = jest.spyOn(repo, 'find')
      const result = service.findByUsername('test');
      expect(find).toBeCalledWith({ where: { username: author.username } });
      return expect(result).resolves.toEqual([author]);
    })
  });
  describe('findOne', () => {
    it('should return author', () => {
      const findOne = jest.spyOn(service, 'findOne');
      const result = service.findOne(1);
      expect(findOne).toBeCalledWith(1);
      return expect(result).resolves.toEqual(author)

    });

  });

  describe('findById', () => {
    it('should return author', () => {
      const findById = jest.spyOn(service, 'findById');
      const result = service.findById(1);
      expect(findById).toBeCalledWith(1);
      return expect(result).resolves.toEqual(author)
    })
  });

  describe('findAll', () => {
    it('should return array of authors', () => {
      const findAll = jest.spyOn(service, 'findAll');
      const result = service.findAll();
      expect(findAll).toBeCalled();
      return expect(result).resolves.toEqual([author]);
    })
  });

  describe('Create', () => {


    it('should Create author entity', () => {
      const create = jest.spyOn(repo, 'create').mockImplementation(() => author);
      expect(repo.create(author)).toEqual(author);

    });
    it('should return inserted result', () => {
      const insert = jest.spyOn(repo, 'insert');

      const result = service.create(author);
      expect(repo.insert).toBeCalledWith(author);
      expect(repo.insert(author)).resolves.toEqual({ generatedMaps: [{}], raw: '', identifiers: [{}] });
      return expect(result).resolves.toEqual({ generatedMaps: [{}], raw: '', identifiers: [{}] });

    });
  });

  describe('update', () => {
   

    it('should be called with id and author object', () => {
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }));
      jest.spyOn(service, 'update');
      const result = service.update(1, author);
      expect(service.update).toBeCalledWith(1, author);

    });
    it('should call repo update with {id} and author obj', () => {
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }));
      jest.spyOn(service, 'update');
      const result = service.update(1, author);
      expect(repo.update).toBeCalledWith({ id: 1 }, author);
    });
    it('should return an update result', () => {
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }));
      jest.spyOn(service, 'update');
      const result = service.update(1, author);
      return expect(result).resolves.toEqual({ raw: 1, generatedMaps: [{}] })
    });

  })
});
