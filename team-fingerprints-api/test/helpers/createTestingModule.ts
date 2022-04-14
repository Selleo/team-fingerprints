import { CacheInterceptor, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { MailService } from 'src/mail/mail.service';
import { MailServiceMock } from './../../test/mocks/mail-service.mock';

export async function createTestingModule() {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [{ provide: MailService, useValue: MailServiceMock }],
  })
    .overrideInterceptor(CacheInterceptor)
    .useValue({})
    .compile();

  const app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.init();
  return app;
}
