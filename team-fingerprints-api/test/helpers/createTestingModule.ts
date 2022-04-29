import { BullModule, getQueueToken } from '@nestjs/bull';
import { CacheInterceptor, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { PrivilegesInterceptorMock } from './../../test/mocks/PrivilegesInterceptor.mock';
import { JwtAuthGuardMock } from './../../test/mocks/JwtAuthGuard.mock';
import { MailServiceMock } from './../../test/mocks/mail-service.mock';
import { PrivilegesInterceptor } from 'src/role/interceptors/Privileges.interceptor';
import { RoleService } from 'src/role/role.service';
import { TeamService } from 'src/company/team/team.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from 'src/role/role.module';
import { TeamModule } from 'src/company/team/team.module';

const EXAMPLE_QUEUE = 'example_queue';

const exampleQueueMock = {
  add: () => jest.fn,
};

export async function createTestingModule() {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [
      BullModule.registerQueue({ name: EXAMPLE_QUEUE }),
      AppModule,
      RoleModule,
      TeamModule,
      ConfigModule,
    ],
    providers: [
      {
        inject: [RoleService, TeamService, ConfigService],
        provide: PrivilegesInterceptor,
        useFactory: (roleService: RoleService, teamService: TeamService) => {
          return new PrivilegesInterceptorMock(roleService, teamService);
        },
      },
    ],
  })
    .overrideInterceptor(PrivilegesInterceptor)
    .useClass(PrivilegesInterceptorMock)
    .overrideProvider(MailService)
    .useValue(new MailServiceMock())
    .overrideProvider(getQueueToken(EXAMPLE_QUEUE))
    .useValue(exampleQueueMock)
    .overrideInterceptor(CacheInterceptor)
    .useValue({})
    .compile();

  const app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const usersService = app.get(UsersService);
  app.useGlobalGuards(new JwtAuthGuardMock(usersService));

  await app.init();
  return app;
}
