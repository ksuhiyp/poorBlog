import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { JwtService, JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ExtractJwt, Strategy } from 'passport-jwt';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;
  let repo: Repository<UserEntity>;
  let hash: string;
  let user;
  let access_token = 'test';
  const cookieExtractor = req => {
    return 'test';
  };
  let JwtModuleOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    ignoreExpiration: false,
    secretOrKey: 'test',
  };
  let bcrypt = { compareSync: (pass: string, hash: string) => true };
  beforeEach(async () => {
    user = [{ username: 'test', password: 'test' }];
    hash = 'test';
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService, UserService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue({ findByUsername: () => user })
      .overrideProvider(JwtService)
      .useValue({ sign: payload => hash })
      .overrideProvider(AuthenticationService)
      .useValue({
        validateUser: (username, password) => user,
        login: user => access_token,
      })
      .compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
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
    });
  });
  describe('login', () => {
    it('should return an access token', () => {
      const payload = { username: 'suhayb', id: 1 };
      const sign = jest.spyOn(jwtService, 'sign');
      expect(service).toBeDefined();
      expect(jwtService).toHaveProperty('sign');
      expect(jwtService.sign(payload)).toBe('test');
      const result = service.login(user);
      expect(sign).toBeCalledWith(payload);
      expect(jwtService.sign(payload)).toEqual('test');
      expect(result).toBe(access_token);
    });
  });
});
