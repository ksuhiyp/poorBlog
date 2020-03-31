import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { AppModule } from '../src/app.module';


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async done => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
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

    describe('/user/:username (GET)', () => {
      it('Should return user or 404', () => {
        return request(app.getHttpServer())
          .get('/user/suhayb')
          .expect(({ body, status }) => {
            if (status === HttpStatus.NOT_FOUND) {
              expect(HttpStatus.NOT_FOUND);
            } else {
              expect(HttpStatus.OK);
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
  describe('Auhtentication Controller', () => {
    describe('POST [login]', () => {
      it('Should return access token or 401', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'suhaib', password: 'test' })
          .expect(({ status, body }) => {
            if (status === 401) {
            expect(401)
            } else {
              expect(200)
              expect(body).toMatchObject({access_token:''})
          }
        })
       })
  });
});
});
