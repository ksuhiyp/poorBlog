import { Test } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { INestApplication } from '@nestjs/common';
describe('Authentication Controller', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;
  let user = { username: 'suhaib', password: 'getmein' };
  let req = { res: { cookie: (cookieName, payload, options) => null, user } };

  let access_token = { access_token: 'test' };
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

    controller = moduleRef.get<AuthenticationController>(
      AuthenticationController,
    );

    service = moduleRef.get<AuthenticationService>(AuthenticationService);
  });

  afterAll(async () => {
    app.close();
  });

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

  describe('login', () => {
    it('should return access token', async () => {
      const login = jest
        .spyOn(service, 'login')
        .mockImplementation(() => access_token);
      const cookie = jest.spyOn(req.res, 'cookie');
      const result = await controller.login(req);
      expect(cookie).toBeCalledWith(
        'jwt',
        service.login({ id: 1, username: 'suhaib' }),
        {
          maxAge: +process.env.COOKIE_MAX_AGE,
          sameSite: 'strict',
          secure: false,
          httpOnly: true,
        },
      );
      expect(login).toBeCalledWith({ id: 1, username: 'suhaib' });
      expect(result).toBe(undefined);
    });
  });
});
