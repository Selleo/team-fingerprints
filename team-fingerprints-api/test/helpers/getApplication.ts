import { INestApplication } from '@nestjs/common';
import { createTestingModule } from './createTestingModule';

let app: INestApplication;

export async function getApplication() {
  if (!app) {
    app = await createTestingModule();
  }
  return app;
}
