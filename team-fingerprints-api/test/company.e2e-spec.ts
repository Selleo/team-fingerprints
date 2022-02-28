import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';

import { AppModule } from 'src/app.module';

describe('Company controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CompanyModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /companies', async () => {
    return await request(app.getHttpServer())
      .get('/companies')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM0ZVVpMFVfdVlnYlpjbV9fSXBDYSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sbGt0ZTQxbS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDU5ODkyODA1NTgxNDkzOTIyMjIiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwLyIsImh0dHBzOi8vZGV2LWxsa3RlNDFtLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDYwNTQzMTcsImV4cCI6MTY0NjE0MDcxNywiYXpwIjoiZ3FHWVFOaXM2SldmbXBkTlE1dG14Vlc5N1NHUHp6dmwiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.g1z9_dbYe_DigZu5uKMx8vVQ-GH3faWw_9R3apxc7piLE2KRxR_uDMps1VZuYLvLCkEai5o1ahgS__g48qNrJwZwiNQBlH0lkAaZXyMPEK8zomRRlbJqo7IBNGYMurmwbtshLbYpoitJ2dM4IU3KQeSURk1iY9jxtdkhgs_4njMJ8j2PyySCFI8LYBPyIBXLd0MT-49N3JpOCI3EBG-KT9W4kq0qj1anUbJh1FV5o8gP92hvu82VpUVuUEJup8GGGM6ip0A-OAkMHVPJ5g627Tl3FfDll3LoFKWfuF1PKfqkCC724NdfpO6GBXY33NQnZguQhD0O7mlYg1M9qWWrVg',
      )
      .then((res) => {
        console.log(res.body);
      });
  });
});
