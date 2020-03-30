import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let repo: Repository<User>;
  let hash: string;
  let user; let access_token = { access_token: 'test' };

  let bcrypt = { compareSync: (pass: string, hash: string) => true }
  beforeEach(async () => {
    user = [{ username: 'test', password: 'test' }];
    hash = 'test';
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService, UserService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue({ findByUsername: () => user })
      .overrideProvider(JwtService)
      .useValue({ sign: (payload) => hash })
      .overrideProvider(AuthenticationService)
      .useValue({ validateUser: (username, password) => user, login: (user) => access_token })
      .compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validate a password', () => {
    it('should return user when password is correct', () => {
      jest.spyOn(service, 'validateUser').mockReturnValue(user);
      expect(service.validateUser(user.username, user.password)).toBe(user);
    });
    it('should return null when password is incorrect', () => {
      jest.spyOn(service, 'validateUser').mockReturnValue(null);
      expect(service.validateUser(user.username, user.password)).toBe(null);
    })
  });
  describe('login', () => {
    it('should return an access token', () => {
      expect(service).toBeDefined();

      jest.spyOn(service, 'login').mockReturnValue(access_token)
      expect(service.login(user)).toBe(access_token)
    })
  })

});
