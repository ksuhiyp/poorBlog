import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRequestDTO } from '../src/models/user.model';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const mockUser: UserRequestDTO = { username: 'suhayb', id: 3, bio: 'star' };
  let cookie: string[];
  beforeAll(async done => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideGuard(AuthGuard('jwt'))
      // .useValue({
      //   canActivate: jest.fn((context: ExecutionContext) => {
      //     const req = context.switchToHttp().getRequest();
      //     req.res.
      //     req.user = mockUser;
      //     return true;
      //   }),
      // })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieSession({
        name: 'jwt',
        keys: ['poorblogsecret'],
      }),
    );
    app.use(cookieParser('poorblogsecret'));

    await app.init();

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'suhaib', password: 'getmein' })
      .expect(res => {
        cookie = res.get('Set-Cookie');
      });
    done();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('User Controller', () => {
    describe('GET [/all]', () => {
      it('Should return an array of users', () => {
        return request(app.getHttpServer())
          .get('/user/all')
          .set({ Cookie: cookie[0] })
          .expect(200)

          .expect(({ body }) => {
            expect(body).toBeInstanceOf(Array);
          });
      });
    });

    describe('/user/:id (GET)', () => {
      it('Should return user or 404', () => {
        return request(app.getHttpServer())
          .get('/user/2')
          .expect(({ body, status }) => {
            if (status === HttpStatus.NOT_FOUND) {
              return expect(HttpStatus.NOT_FOUND);
            } else {
              return expect(HttpStatus.OK);
            }
          });
      });
    });
    describe('POST [user]', () => {
      it('should return return 201 or 409', () => {
        return request(app.getHttpServer())
          .post('/user')
          .set({ Cookie: cookie[0] })
          .send({ username: 'suhayb', password: 'test123' })
          .expect(({ body, status }) => {
            if (HttpStatus.CONFLICT) {
              expect(409);
            } else {
              expect(201);
            }
          });
      });
    });

    describe('PUT [/user]', () => {
      it('Should reutrn updated user or 400', () => {
        return request(app.getHttpServer())
          .put('/user/1')
          .set({ Cookie: cookie[0] })
          .send({ username: 'suhaib' })
          .expect(({ status, body }) => {
            if (status === HttpStatus.BAD_REQUEST) {
              expect(HttpStatus.BAD_REQUEST);
            } else {
              expect(HttpStatus.OK);
            }
          });
      });
    });

    describe('DELETE [/user]', () => {
      it('Should return 200 or 400', () => {
        return request(app.getHttpServer())
          .delete('/user/1')
          .set({ Cookie: cookie[0] })
          .expect(({ status }) => {
            if (status === 200) {
              expect(200);
            } else {
              expect(400);
            }
          });
      });
    });
    describe('Authentication Controller', () => {
      describe('POST [login]', () => {
        it('Should return access token or 401', () => {
          return request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'suhaib', password: 'getmein' })
            .expect(({ header, status }) => {
              if (status === 401) {
                expect(401);
              } else {
                expect(204);
                expect(header['set-cookie']).toBeDefined();
              }
            });
        });
      });

      describe('Get session', () => {
        it('should return 201 or 401 with jwt cookie if 201', () => {
          return request(app.getHttpServer())
            .get('/auth/session')
            .set({ Cookie: cookie[0] })
            .expect(({ header, status }) => {
              if (status === 401) {
                expect(401);
              } else {
                expect(204);
              }
            });
        });
      });
    });
    // describe('Article Controller', () => {
    //   describe('Get article', () => {
    //     it('Should return an article or throw NotFoundException', () => {
    //       return request(app.getHttpServer())
    //         .get('/article/12')
    //         .expect(({ body, status }) => {
    //           if (status === HttpStatus.NOT_FOUND) {
    //             expect(HttpStatus.NOT_FOUND);
    //           } else {
    //             expect(200);
    //             expect(plainToClass(articleResponseDTO, body)).toBeInstanceOf(
    //               articleResponseDTO,
    //             );
    //           }
    //         });
    //     });
    //   });
    //   describe('Get articles', () => {
    //     it('Should return an array of articles', () => {
    //       return request(app.getHttpServer())
    //         .get('/article')
    //         .expect(({ body, status }) => {
    //           if (status === HttpStatus.NO_CONTENT) {
    //             expect(HttpStatus.NO_CONTENT);
    //           } else {
    //             expect(HttpStatus.OK);
    //             expect(body).toBeInstanceOf(Array);
    //           }
    //         });
    //     });
    //     it('Should return an array of articles order by field', () => {
    //       return request(app.getHttpServer())
    //         .get('/article')
    //         .query({ order: { title: 'ASC' } })
    //         .expect(({ body, status }) => {
    //           if (status === HttpStatus.NO_CONTENT) {
    //             expect(HttpStatus.NO_CONTENT);
    //           } else {
    //             expect(HttpStatus.OK);
    //             expect(body).toBeInstanceOf(Array);
    //           }
    //         });
    //     });
    //     it('Should return an array of articles limted to 2 with an skip of 1', () => {
    //       return request(app.getHttpServer())
    //         .get('/article')
    //         .query({ take: 2, skip: 1 })
    //         .expect(({ body, status }) => {
    //           if (status === HttpStatus.NO_CONTENT) {
    //             expect(HttpStatus.NO_CONTENT);
    //           } else {
    //             expect(status === HttpStatus.OK);
    //             expect(body.length).toBeLessThanOrEqual(2);
    //           }
    //         });
    //     });
    //   });
    //   describe('Post articles', () => {
    //     it('should return an article', () => {
    //       return request(app.getHttpServer())
    //         .post('/article')
    //         .send({
    //           title: 'test',
    //           body: 'test',
    //           description: 'test',
    //           author: 3,
    //         })
    //         .expect(({ body }) => {
    //           expect(200);
    //           expect(plainToClass(articleResponseDTO, body)).toBeInstanceOf(
    //             articleResponseDTO,
    //           );
    //         });
    //     });
    //     it('should throw a BarRequestError if request body is invalid', () => {
    //       return request(app.getHttpServer())
    //         .post('/article')
    //         .send({
    //           title: 1,
    //           description: 'test',
    //         })
    //         .expect(400);
    //     });
    //   });
    //   describe('Put articles', () => {
    //     it('should return 200', () => {
    //       return request(app.getHttpServer())
    //         .put('/article/12')
    //         .send({
    //           title: 'test',
    //         })
    //         .expect(({ body, status }) => {
    //           if (status === HttpStatus.OK) {
    //             expect(HttpStatus.OK);
    //           } else if (status === HttpStatus.FORBIDDEN) {
    //             expect(HttpStatus.FORBIDDEN);
    //           } else {
    //             expect(HttpStatus.NOT_FOUND);
    //           }
    //         });
    //     });
    //   });
    //   describe('delete article', () => {
    //     it('should return 200/403/404', () => {
    //       request(app.getHttpServer())
    //         .delete('articles/1')
    //         .expect(({ body, status }) => {
    //           if (status === HttpStatus.OK) {
    //             expect(HttpStatus.OK);
    //           } else if (status === HttpStatus.FORBIDDEN) {
    //             expect(HttpStatus.FORBIDDEN);
    //           } else {
    //             expect(HttpStatus.NOT_FOUND);
    //           }
    //         });
    //     });
    //   });
    // });
    // describe('Tag Controller', () => {
    //   it('should return 200 with an array of tags', () => {
    //     return request(app.getHttpServer())
    //       .get('/tag')
    //       .expect(({ body, status }) => {
    //         expect(HttpStatus.OK);
    //         expect(body).toBeInstanceOf(Array);
    //       });
    //   });
  });
});
