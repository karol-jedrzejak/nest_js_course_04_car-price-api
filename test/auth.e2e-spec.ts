import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AuthenticationSystem (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('handles a successful signup request', () => {
    const email = 'jakis_koles@email.pl';
    const password = 'passtest2';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: password })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  afterEach(async () => {
    await app.close();
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'jakis_koles_2@poczta.fm';
    const password = 'passtest2';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: password });

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie!)
      .expect(200);
    expect(body.email).toEqual(email);
    });
});
