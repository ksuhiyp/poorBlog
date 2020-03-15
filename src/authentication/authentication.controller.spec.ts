import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthorDto } from 'src/author/dto/author.dto';
import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthorService } from '../author/author.service';
import { JwtStrategy } from './jwt.strategy';
describe('Authentication Controller', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;
  let req = { user: () => null };
  let res = { set: () => { }, send: () => { } };
  let access_token = { access_token: 'test' };
  let author = { username: 'suhaib', password: 'getmein' };
  let app: INestApplication;
  beforeEach(async () => {
    const author: AuthorDto = { username: 'suhaib' }
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [AuthenticationService],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(AuthenticationService)
      .useValue({ login: () => access_token })
      .compile();


    controller = moduleRef.get<AuthenticationController>(AuthenticationController);

    service = moduleRef.get<AuthenticationService>(AuthenticationService);
  });

  afterAll(async () => {
    app.close();
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it(`/POSTS login`, () => {
  //  return request(app.getHttpServer())
  //     .post('login')
  //     .set({ author })
  //     // .expect('Authorization', `Bearser ${access_token.access_token}`)
  //     .expect(201)
  //   // request(app.getHttpServer()).get('author/all').expect(200,(body)=>{})
  // });

  // it('should return access token on login', () => {
  //   const login = jest.spyOn(service, 'login').mockReturnValue(access_token)
  //   expect(login).toBeCalledWith(author);

  //   controller.login(req, res);
  // })

  describe('login',  () => {
    it('should return access token', async () => {
      jest.spyOn(service, 'login').mockImplementation(() => access_token);
      jest.spyOn(req, 'user').mockImplementation(() => author);
      jest.spyOn(res, 'set').mockReturnValue(null)
      jest.spyOn(res, 'set').mockReturnValue(null)
      jest.spyOn(res, 'send').mockReturnValue(null)
      expect(await controller.login(req)).toBe(access_token);

    })
  })

});
