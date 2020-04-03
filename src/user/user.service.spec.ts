import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, UpdateResult, InsertResult } from 'typeorm';
import { MockUserRepository } from '../../test/mocks/mock-user-repository';
import {
  UserResponseDTO,
  UserLoginDTO,
  UserRegistrationDTO,
} from '/home/suhayb/repos/poor-blog/src/models/user.model';

describe('UserService', () => {
  let service: UserService;
  let user: UserResponseDTO = {
    username: 'test',
    id: 1,
    articles: [],
    bio: null,
    photo: null,
  };
  let userRes: UserResponseDTO = {
    id: 1,
    username: 'test',
    updatedAt: new Date(),
    createdAt: new Date(),
    photo: null,
    bio: null,
    articles: [],
  };
  let userEntity: User = {
    id: 1,
    username: 'test',
    updatedAt: new Date(),
    createdAt: new Date(),
    photo: null,
    bio: null,
    articles: [],
    password: 'test',
    toJson: () => userRes,
  };
  let userReg: UserRegistrationDTO = { username: 'test', password: 'test' };
  let userLogin: UserLoginDTO = { username: 'test', password: 'test' };
  let repo: Repository<User>;
  let mockRepository: Repository<User> = new MockUserRepository();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<MockUserRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return an array of user', () => {
      jest.spyOn(service, 'findByUsername');
      const find = jest.spyOn(repo, 'findOne');
      const result = service.findByUsername('test');
      expect(find).toBeCalledWith({ where: { username: userRes.username } });
      return expect(result).resolves.toMatchObject(userRes);
    });
  });
  describe('findOne', () => {
    it('should return user', () => {
      const findOne = jest.spyOn(service, 'findOne');
      const result = service.findOne(1);
      expect(findOne).toBeCalledWith(1);
      return expect(result).resolves.toMatchObject(userRes);
    });
  });

  describe('findById', () => {
    it('should return user', () => {
      const findById = jest.spyOn(service, 'findById');
      const result = service.findById(1);
      expect(findById).toBeCalledWith(1);
      return expect(result).resolves.toMatchObject(userRes);
    });
  });

  describe('findAll', () => {
    it('should return array of users', () => {
      const findAll = jest.spyOn(service, 'findAll');
      const result = service.findAll();
      expect(findAll).toBeCalled();
      return expect(result).resolves.toMatchObject([userRes]);
    });
  });

  describe('Create', () => {
    it('should Create user entity', () => {
      const create = jest
        .spyOn(repo, 'create')
        .mockImplementation(() => userEntity);
      expect(repo.create(userReg)).toEqual(userEntity);
    });
    it('should return inserted result', () => {
      const insert = jest.spyOn(repo, 'insert');

      const result = service.create(userReg);
      expect(repo.insert).toBeCalledWith(userReg);
      expect(repo.insert(userReg)).resolves.toEqual({
        generatedMaps: [{}],
        raw: '',
        identifiers: [{}],
      });
      return expect(result).resolves.toEqual({
        generatedMaps: [{}],
        raw: '',
        identifiers: [{}],
      });
    });
  });

  describe('update', () => {
    it('should be called with id and user object', () => {
      jest
        .spyOn(repo, 'update')
        .mockImplementation(() =>
          Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }),
        );
      jest.spyOn(service, 'update');
      const result = service.update(1, user);
      expect(service.update).toBeCalledWith(1, user);
    });
    it('should call repo update with {id} and user obj', () => {
      jest
        .spyOn(repo, 'update')
        .mockImplementation(() =>
          Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }),
        );
      jest.spyOn(service, 'update');
      const result = service.update(1, user);
      expect(repo.update).toBeCalledWith({ id: 1 }, user);
    });
    it('should return an update result', () => {
      jest
        .spyOn(repo, 'update')
        .mockImplementation(() =>
          Promise.resolve<UpdateResult>({ raw: 1, generatedMaps: [{}] }),
        );
      jest.spyOn(service, 'update');
      const result = service.update(1, user);
      return expect(result).resolves.toEqual({ raw: 1, generatedMaps: [{}] });
    });
  });
});