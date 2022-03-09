import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import * as mongoose from 'mongoose';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/models/company.model';
import { User } from 'src/users/models/user.model';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Role } from 'src/role/role.type';
import { CreateSurveyDto } from 'src/survey/dto/survey.dto';
import { Survey } from 'src/survey/models/survey.model';

const usersData: Partial<User>[] = [
  {
    email: 'bedo@es.com',
    firstName: 'Bedo',
    lastName: 'Es',
    authId: 'sdh2hfefowhefnjkswfbnw',
    role: Role.USER,
  },
  {
    email: 'yetiasg@gmail.com',
    firstName: 'Kinny',
    lastName: 'Zimmer',
    authId: 'sdfh2hfefowhefnjkswfbnw',
    role: Role.SUPER_ADMIN,
  },
];

const newSurveyData: CreateSurveyDto = {
  title: 'new survey',
};

const surveyMock: Partial<Survey> = {
  title: newSurveyData.title,
  isPublic: false,
  archived: false,
  categories: [],
  amountOfQuestions: 0,
};

const getSurvey = ({
  title,
  isPublic,
  archived,
  categories,
  amountOfQuestions,
}: Partial<Survey>): typeof surveyMock => ({
  title,
  isPublic,
  archived,
  categories,
  amountOfQuestions,
});

jest.setTimeout(10000);

describe('Company controller (e2e)', () => {
  let app: INestApplication;
  let userModel: any;
  let user: User;
  let survey: Partial<Survey>;
  let surveyId: string;

  const createUser = async (user: CreateUserDto) => {
    const userExists = await userModel.findOne({ email: user.email });
    if (userExists) await userModel.findOneAndDelete({ email: user.email });
    const newUser = await userModel.create(user);
    await newUser.save();
    return newUser;
  };

  const removeUser = async (userId: string) => {
    return await userModel.findOneAndDelete({ _id: userId });
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        CompanyModule,
        TeamModule,
        RoleModule,
        MongooseModule.forFeature([
          {
            name: Company.name,
            schema: CompanySchema,
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = await moduleFixture.get(getModelToken(User.name));
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
    await app.close();
  });

  describe('GET /surveys - getting all surveys according to user role', () => {
    describe('Getting empty arrays', () => {
      it('returns empty array for role: USER', async () => {
        user = await createUser(usersData[0] as CreateUserDto);

        return await request(app.getHttpServer())
          .get('/surveys')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
            expect(body).toEqual([]);
          })
          .finally(async () => await removeUser(user._id));
      });

      it('returns empty array for role: USER', async () => {
        user = await createUser(usersData[1] as CreateUserDto);

        return await request(app.getHttpServer())
          .get('/surveys')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(0);
            expect(body).toEqual([]);
          })
          .finally(async () => await removeUser(user._id));
      });
    });
  });

  describe('POST /surveys - create new survey', () => {
    it('throws forbidder error for user with bad role', async () => {
      user = await createUser(usersData[0] as CreateUserDto);

      return await request(app.getHttpServer())
        .post('/surveys')
        .send(newSurveyData)
        .expect(403)
        .then(({ body }) => {
          expect(body.error).toBe('Forbidden');
        })
        .finally(async () => await removeUser(user._id));
    });

    it('returns new survey', async () => {
      user = await createUser(usersData[1] as CreateUserDto);

      return await request(app.getHttpServer())
        .post('/surveys')
        .send(newSurveyData)
        .expect(201)
        .then(({ body }) => {
          survey = getSurvey(body);
          expect(survey).toMatchObject(surveyMock);
          surveyId = new mongoose.Types.ObjectId(body._id).toString();
        })
        .finally(async () => await removeUser(user._id));
    });
  });

  describe('PATCH /surveys - update survey', () => {
    it('returns updated survey', async () => {
      user = await createUser(usersData[1] as CreateUserDto);

      const updateData: Partial<Survey> = {
        title: 'fififi',
        isPublic: true,
        archived: true,
      };

      return await request(app.getHttpServer())
        .patch(`/surveys/${surveyId}`)
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          survey = { ...survey, ...updateData };
          expect(getSurvey(body)).toMatchObject(survey);
        })
        .finally(async () => await removeUser(user._id));
    });
  });

  describe('GET /surveys - getting survey by given id', () => {
    it('returns survey', async () => {
      user = await createUser(usersData[0] as CreateUserDto);

      return await request(app.getHttpServer())
        .get(`/surveys/${surveyId}`)
        .expect(200)
        .then(({ body }) => {
          expect(getSurvey(body)).toMatchObject(survey);
        })
        .finally(async () => await removeUser(user._id));
    });
  });

  describe('DELETE /surveys - reomove survey by given id', () => {
    it('removes survey', async () => {
      user = await createUser(usersData[1] as CreateUserDto);

      return await request(app.getHttpServer())
        .delete(`/surveys/${surveyId}`)
        .expect(200)
        .then(({ body }) => {
          expect(getSurvey(body)).toMatchObject(survey);
        })
        .finally(async () => await removeUser(user._id));
    });
  });
});
