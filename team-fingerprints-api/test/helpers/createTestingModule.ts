import { BullModule, getQueueToken } from '@nestjs/bull';
import { CacheInterceptor, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { MailService } from 'src/mail/mail.service';
import { MailServiceMock } from './../../test/mocks/mail-service.mock';

const EXAMPLE_QUEUE = 'example_queue';

const exampleQueueMock = {
  add: jest.fn(),
  inviteToCompanyMail: jest.fn().mockReturnValue(true),
};

export async function createTestingModule() {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [BullModule.registerQueue({ name: EXAMPLE_QUEUE }), AppModule],
  })
    .overrideProvider(MailService)
    .useValue(new MailServiceMock())
    .overrideProvider(getQueueToken(EXAMPLE_QUEUE))
    .useValue(exampleQueueMock)
    .overrideInterceptor(CacheInterceptor)
    .useValue({})
    .compile();

  const app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.init();
  return app;
}
