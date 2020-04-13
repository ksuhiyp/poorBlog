import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { AppModule } from '../src/app.module';
import { articleResponseDTO } from '../src/models/article.model';
import { plainToClass } from 'class-transformer';
import { UserRequestDTO } from '../src/models/user.model';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mockUser: UserRequestDTO = { username: 'suhayb', id: 3, bio: 'star' };
  beforeAll(async done => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

      describe('POST [user]', () => {
        it('should return return 201 or 409', () => {
          return request(app.getHttpServer())
            .post('/user')
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
            .expect(({ status }) => {
              if (status === 200) {
                expect(200);
              } else {
                expect(400);
              }
            });
        });
      });
    });
  });
  describe('Authtentication Controller', () => {
    describe('POST [login]', () => {
      it('Should return access token or 401', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'suhaib', password: 'getmein' })
          .expect(({ status, body }) => {
            if (status === 401) {
              expect(401);
            } else {
              expect(201);
              expect(body).toEqual({});
            }
          });
      });
    });
  });
  describe('Article Controller', () => {
    describe('Get article', () => {
      it('Should return an article or throw NotFoundException', () => {
        return request(app.getHttpServer())
          .get('/article/12')
          .expect(({ body, status }) => {
            if (status === HttpStatus.NOT_FOUND) {
              expect(HttpStatus.NOT_FOUND);
            } else {
              expect(200);
              expect(plainToClass(articleResponseDTO, body)).toBeInstanceOf(
                articleResponseDTO,
              );
            }
          });
      });
    });
    describe('Get articles', () => {
      it('Should return an array of articles', () => {
        return request(app.getHttpServer())
          .get('/article')
          .expect(({ body, status }) => {
            if (status === HttpStatus.NO_CONTENT) {
              expect(HttpStatus.NO_CONTENT);
            } else {
              expect(HttpStatus.OK);
              expect(body).toBeInstanceOf(Array);
            }
          });
      });
      it('Should return an array of articles order by field', () => {
        return request(app.getHttpServer())
          .get('/article')
          .query({ order: { title: 'ASC' } })
          .expect(({ body, status }) => {
            if (status === HttpStatus.NO_CONTENT) {
              expect(HttpStatus.NO_CONTENT);
            } else {
              expect(HttpStatus.OK);
              expect(body).toBeInstanceOf(Array);
            }
          });
      });
      it('Should return an array of articles limted to 2 with an skip of 1', () => {
        return request(app.getHttpServer())
          .get('/article')
          .query({ take: 2, skip: 1 })
          .expect(({ body, status }) => {
            if (status === HttpStatus.NO_CONTENT) {
              expect(HttpStatus.NO_CONTENT);
            } else {
              expect(status === HttpStatus.OK);
              expect(body.length).toBeLessThanOrEqual(2);
            }
          });
      });
    });
    describe('Post articles', () => {
      it('should return an article', () => {
        return request(app.getHttpServer())
          .post('/article')
          .send({
            title: 'test',
            body: 'test',
            describtion: 'test',
            author: 3,
          })
          .expect(({ body }) => {
            expect(200);
            expect(plainToClass(articleResponseDTO, body)).toBeInstanceOf(
              articleResponseDTO,
            );
          });
      });
      it('should throw a BarRequestError if request body is invalid', () => {
        return request(app.getHttpServer())
          .post('/article')
          .send({
            title: 1,
            describtion: 'test',
          })
          .expect(400);
      });
    });
    describe('Put articles', () => {
      it('should return 200', () => {
        return request(app.getHttpServer())
          .put('/article/12')
          .send({
            title: 'test',
          })
          .expect(({ body, status }) => {
            if (status === HttpStatus.OK) {
              expect(HttpStatus.OK);
            } else if (status === HttpStatus.FORBIDDEN) {
              expect(HttpStatus.FORBIDDEN);
            } else {
              expect(HttpStatus.NOT_FOUND);
            }
          });
      });
    });
    describe('delete article', () => {
      it('should return 200/403/404', () => {
        request(app.getHttpServer())
          .delete('articles/1')
          .expect(({ body, status }) => {
            if (status === HttpStatus.OK) {
              expect(HttpStatus.OK);
            } else if (status === HttpStatus.FORBIDDEN) {
              expect(HttpStatus.FORBIDDEN);
            } else {
              expect(HttpStatus.NOT_FOUND);
            }
          });
      });
    });
  });
  describe('Tag Controller', () => {
    it('should return 200 with an array of tags', () => {
      return request(app.getHttpServer())
        .get('/tag')
        .expect(({ body, status }) => {
          expect(HttpStatus.OK);
          expect(body).toBeInstanceOf(Array);
        });
    });
  });
});
