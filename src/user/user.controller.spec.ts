import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { resolve } from 'dns';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;
  let user: User;
  beforeEach(async () => {
    user = { username: 'test', password: 'test' };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService,
        { provide: getRepositoryToken(User), useClass: Repository }]
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService)
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get all users', () => {
    it('should return array of Users', async () => {
      let result = [user]
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(result));
      return expect(controller.getAll()).resolves.toBe(result)
    })
  });
  describe('findByUserName', () => {
    it('should return an user', () => {
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([user]))
      return expect(controller.findByUserName('test')).resolves.toBe(user)
    });
    it('should throw if no matching user found', () => {
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([]))
      jest.spyOn(controller, 'findByUserName').mockRejectedValue(new Error(`Username ${user.username} already exists`))
      return expect(controller.findByUserName('test')).rejects.toThrow(new Error(`Username ${user.username} already exists`))

    })
  })

  describe('create', () => {
    it('should return undefined if user was created', () => {
      jest.spyOn(service, 'create').mockImplementation(() => null)
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([]))
      return expect(controller.create(user)).resolves.toEqual(undefined)

    });
    it('should throw if the username was already taken', () => {
      jest.spyOn(service, 'create').mockImplementation(() => null)
      jest.spyOn(service, 'findByUsername').mockImplementation((username) => Promise.resolve([]))
      jest.spyOn(controller, 'create').mockRejectedValue(new Error(`Username ${user.username} already exists`))
      return expect(controller.create(user)).rejects.toThrow(new Error(`Username ${user.username} already exists`))

    })
  });

  describe('update', () => {

    it('should return updated user if operation succeed', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve<UpdateResult>({ generatedMaps: [user], raw: undefined, affected: 1 }));

      return expect(controller.update(user, 1)).resolves.toEqual(user)
    });
    it('should throw if user was not found', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.reject(new Error('Not found')));

      return expect(controller.update(user, 1)).rejects.toThrow(new Error('Not found'))
    });
  });
  describe('Delete', () => {
    it('Should return undefined if deletion succeed', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve<DeleteResult>({ raw: undefined, affected: 1 }));
      return expect(controller.delete(1)).resolves.toEqual(undefined)
    });
    it('Should throw if user was not found', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.reject(new Error('Not found')));
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve<DeleteResult>({ raw: undefined, affected: 1 }));
      return expect(controller.delete(1)).rejects.toThrow(new Error('Not found'))
    })
  })
});
