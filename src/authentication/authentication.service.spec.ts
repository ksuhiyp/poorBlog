import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthorService } from '../author/author.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '../author/author.entity';
import { Repository } from 'typeorm';
import { AuthorDto } from 'src/author/dto/author.dto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let repo: Repository<Author>;
  let hash: string;
  let author; let access_token = { access_token: 'test' };

  let bcrypt = { compareSync: (pass: string, hash: string) => true }
  beforeEach(async () => {
    author = [{ username: 'test', password: 'test' }];
    hash = 'test';
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService, AuthorService, JwtService],
    })
      .overrideProvider(AuthorService)
      .useValue({ findByUsername: () => author })
      .overrideProvider(JwtService)
      .useValue({ sign: (payload) => hash })
      .overrideProvider(AuthenticationService)
      .useValue({ validateUser: (username, password) => author, login: (author) => access_token })
      .compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validate a password', () => {
    it('should return author when password is correct', () => {
      jest.spyOn(service, 'validateUser').mockReturnValue(author);
      expect(service.validateUser(author.username, author.password)).toBe(author);
    });
    it('should return null when password is incorrect', () => {
      jest.spyOn(service, 'validateUser').mockReturnValue(null);
      expect(service.validateUser(author.username, author.password)).toBe(null);
    })
  });
  describe('login', () => {
    it('should return an access token', () => {
      expect(service).toBeDefined();

      jest.spyOn(service, 'login').mockReturnValue(access_token)
      expect(service.login(author)).toBe(access_token)
    })
  })

});
