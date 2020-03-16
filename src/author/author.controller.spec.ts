import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import { AuthGuard } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { resolve } from 'dns';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Author Controller', () => {
  let controller: AuthorController;
  let service: AuthorService;
  let author: Author;
  beforeEach(async () => {
    author = { username: 'test', password: 'test' };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [AuthorService,
        { provide: getRepositoryToken(Author), useClass: Repository }]
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthorController>(AuthorController);
    service = module.get<AuthorService>(AuthorService)
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get all authors', () => {
    it('should return array of Authors', async () => {
      let result = [author]
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(result));
      return expect(controller.getAll()).resolves.toBe(result)
    })
  });
  describe('findByUserName', () => {
    it('should return an author', () => {
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([author]))
      return expect(controller.findByUserName('test')).resolves.toBe(author)
    });
    it('should throw if no matching author found', () => {
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([]))
      jest.spyOn(controller, 'findByUserName').mockRejectedValue(new Error(`Username ${author.username} already exists`))
      return expect(controller.findByUserName('test')).rejects.toThrow(new Error(`Username ${author.username} already exists`))

    })
  })

  describe('create', () => {
    it('should return undefined if user was created', () => {
      jest.spyOn(service, 'create').mockImplementation(() => null)
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([]))
      return expect(controller.create(author)).resolves.toEqual(undefined)

    });
    it('should throw if the username was already taken', () => {
      jest.spyOn(service, 'create').mockImplementation(() => null)
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([]))
      jest.spyOn(controller, 'create').mockRejectedValue(new Error(`Username ${author.username} already exists`))
      return expect(controller.create(author)).rejects.toThrow(new Error(`Username ${author.username} already exists`))

    })
  });

  describe('update', () => {

    it('should return updated author if operation succeed', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(author));
      jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ generatedMaps: [author], raw: undefined, affected: 1 }));

      return expect(controller.update(author, 1)).resolves.toEqual(author)
    });
    it('should throw if author was not found', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.reject(new Error('Not found')));

      return expect(controller.update(author, 1)).rejects.toThrow(new Error('Not found'))
    });
  });
  describe('Delete', () => {
    it('Should return undefined if deletion succeed', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(author));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve<DeleteResult>({ raw: undefined, affected: 1 }));
      return expect(controller.delete(1)).resolves.toEqual(undefined)
    });
    it('Should throw if author was not found', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.reject(new Error('Not found')));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve<DeleteResult>({ raw: undefined, affected: 1 }));
      return expect(controller.delete(1)).rejects.toThrow(new Error('Not found'))
    })
  })
});
