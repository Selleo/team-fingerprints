import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import { Role } from 'src/role/role.type';
import * as mongoose from 'mongoose';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { TeamModule } from 'src/company/team/team.module';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UserProfileI } from 'src/auth/interfaces/auth.interface';

const userData: CreateUserDto = {
  email: 'yetiasg@gmail.com',
  firstName: 'Kinny',
  lastName: 'Zimmer',
  authId: 'sdfh2hfefowhefnjkswfbnw',
};

let user: Partial<User> = {
  email: userData.email,
  firstName: userData.firstName,
  lastName: userData.lastName,
  authId: userData.authId,
  role: Role.USER,
  companyId: '',
  surveysAnswers: [],
};

const userProfile = (userId: string, role: Role): Partial<UserProfileI> => ({
  id: userId,
  email: user.email,
  role,
  canCreateTeam: false,
  company: {} as any,
  team: {} as any,
});

describe('Company controller (e2e)', () => {
  let app: INestApplication;
  let userModel: any;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UsersModule,
        CompanyModule,
        RoleModule,
        TeamModule,
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get(getModelToken(User.name));
    await app.init();
  });

  describe('POST /teams - create company', () => {
    it('returns true', async () => {
      return true;
    });
  });

  afterAll(async () => {
    await userModel.findOneAndDelete({ _id: userId });
    await mongoose.connection.close(true);
    await app.close();
  });

  describe('POST /users - create user', () => {
    it('returns new user', async () => {
      return await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject(user);
        });
    });
  });

  describe('GET /users - get current logged in user', () => {
    it('returns user', async () => {
      return await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then(({ body }) => {
          userId = new mongoose.Types.ObjectId(body._id).toString();
          expect(body).toMatchObject(user);
        });
    });
  });

  describe('GET /users/all - get all existing users', () => {
    it('returns array of users', async () => {
      return await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject(user);
        });
    });
  });

  describe('GET /users/profiles - get users profiles by given ids', () => {
    describe('Profile of user who can not create team', () => {
      it('returns profile for TEAM_LEADER', async () => {
        await userModel.findOneAndUpdate(
          { _id: userId },
          { role: Role.TEAM_LEADER },
        );
        await request(app.getHttpServer())
          .post('/users/profiles')
          .send([userId])
          .expect(201)
          .then(({ body }) => {
            expect(body.length).toBe(1);
            expect(body[0]).toMatchObject(
              userProfile(userId, Role.TEAM_LEADER),
            );
          })
          .finally(async () => {
            await userModel.findOneAndUpdate(
              { _id: userId },
              { role: Role.USER },
            );
          });
      });

      it('returns profile for COMPANY_ADMIN', async () => {
        await userModel.findOneAndUpdate(
          { _id: userId },
          { role: Role.COMPANY_ADMIN },
        );
        return await request(app.getHttpServer())
          .post('/users/profiles')
          .send([userId])
          .expect(201)
          .then(({ body }) => {
            expect(body.length).toBe(1);
            expect(body[0]).toMatchObject(
              userProfile(userId, Role.COMPANY_ADMIN),
            );
          })
          .finally(async () => {
            await userModel.findOneAndUpdate(
              { _id: userId },
              { role: Role.USER },
            );
          });
      });
    });
  });

  describe('PATCH /users', () => {
    it('return updated user', async () => {
      const dataToUpdate = {
        firstName: 'Bede',
        lastName: 'Os',
      };

      return await request(app.getHttpServer())
        .patch('/users')
        .send({
          firstName: dataToUpdate.firstName,
          lastName: dataToUpdate.lastName,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({ ...user, ...dataToUpdate });
        })
        .finally(() => {
          user = { ...user, ...dataToUpdate };
        });
    });
  });

  describe('GET /users/all - returns all existing users', () => {
    it('returns emty array', async () => {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { role: Role.TEAM_LEADER },
      );
      return request(app.getHttpServer())
        .get('/users/all')
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(1);
          expect(body[0]).toMatchObject({ ...user, role: Role.TEAM_LEADER });
        })
        .finally(async () => {
          await userModel.findOneAndUpdate(
            { _id: userId },
            { role: Role.USER },
          );
        });
    });
  });
});
