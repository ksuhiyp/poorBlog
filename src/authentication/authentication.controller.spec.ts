import { Test } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { INestApplication } from '@nestjs/common';
describe('Authentication Controller', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;
  let req = { user: () => null };
  let res = { set: () => { }, send: () => { } };
  let access_token = { access_token: 'test' };
  let user = { username: 'suhaib', password: 'getmein' };
  let app: INestApplication;
  beforeEach(async () => {
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
  //     .set({ user })
  //     // .expect('Userization', `Bearser ${access_token.access_token}`)
  //     .expect(201)
  //   // request(app.getHttpServer()).get('user/all').expect(200,(body)=>{})
  // });

  // it('should return access token on login', () => {
  //   const login = jest.spyOn(service, 'login').mockReturnValue(access_token)
  //   expect(login).toBeCalledWith(user);

  //   controller.login(req, res);
  // })

  describe('login',  () => {
    it('should return access token', async () => {
      jest.spyOn(service, 'login').mockImplementation(() => access_token);
      jest.spyOn(req, 'user').mockImplementation(() => user);
      jest.spyOn(res, 'set').mockReturnValue(null)
      jest.spyOn(res, 'set').mockReturnValue(null)
      jest.spyOn(res, 'send').mockReturnValue(null)
      expect(await controller.login(req)).toBe(access_token);

    })
  })

});
