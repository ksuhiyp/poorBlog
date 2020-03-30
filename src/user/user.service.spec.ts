import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { MockUserRepository } from '../../test/mocks/mock-user-repository';
import { response } from 'express';
import { resolve, resolveSoa } from 'dns';

describe('UserService', () => {
  let service: UserService;
  let user: User = { username: 'test', password: 'test' }
  let repo: Repository<User>;
  let mockRepository: Repository<User> = new MockUserRepository
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<MockUserRepository>(getRepositoryToken(User))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return an array of user', () => {
      jest.spyOn(service, 'findByUsername')
      const find = jest.spyOn(repo, 'find')
      const result = service.findByUsername('test');
      expect(find).toBeCalledWith({ where: { username: user.username } });
      return expect(result).resolves.toEqual([user]);
    })
  });
  describe('findOne', () => {
    it('should return user', () => {
      const findOne = jest.spyOn(service, 'findOne');
      const result = service.findOne(1);
      expect(findOne).toBeCalledWith(1);
      return expect(result).resolves.toEqual(user)

    });

  });

  describe('findById', () => {
    it('should return user', () => {
      const findById = jest.spyOn(service, 'findById');
      const result = service.findById(1);
      expect(findById).toBeCalledWith(1);
      return expect(result).resolves.toEqual(user)
    })
  });

  describe('findAll', () => {
    it('should return array of users', () => {
      const findAll = jest.spyOn(service, 'findAll');
      const result = service.findAll();
      expect(findAll).toBeCalled();
      return expect(result).resolves.toEqual([user]);
    })
  });

  describe('Create', () => {


    it('should Create user entity', () => {
      const create = jest.spyOn(repo, 'create').mockImplementation(() => user);
      expect(repo.create(user)).toEqual(user);

    });
    it('should return inserted result', () => {
      const insert = jest.spyOn(repo, 'insert');

      const result = service.create(user);
      expect(repo.insert).toBeCalledWith(user);
      expect(repo.insert(user)).resolves.toEqual({ generatedMaps: [{}], raw: '', identifiers: [{}] });
      return expect(result).resolves.toEqual({ generatedMaps: [{}], raw: '', identifiers: [{}] });

    });
  });

  describe('update', () => {
   

    it('should be called with id and user object', () => {
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }));
      jest.spyOn(service, 'update');
      const result = service.update(1, user);
      expect(service.update).toBeCalledWith(1, user);

    });
    it('should call repo update with {id} and user obj', () => {
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }));
      jest.spyOn(service, 'update');
      const result = service.update(1, user);
      expect(repo.update).toBeCalledWith({ id: 1 }, user);
    });
    it('should return an update result', () => {
      jest.spyOn(repo, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }));
      jest.spyOn(service, 'update');
      const result = service.update(1, user);
      return expect(result).resolves.toEqual({ raw: 1, generatedMaps: [{}] })
    });

  })
});
