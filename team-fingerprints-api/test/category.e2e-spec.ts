import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import * as mongoose from 'mongoose';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/models/user.model';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { RoleType } from 'src/role/role.type';
import { Survey, SurveySchema } from 'src/survey/models/survey.model';

const usersData: Partial<User>[] = [
  {
    email: 'yetiasg@gmail.com',
    firstName: 'Kinny',
    lastName: 'Zimmer',
    authId: 'sdfh2hfefowhefnjkswfbnw',
    role: RoleType.SUPER_ADMIN,
  },
];

const newSurveyData: Partial<Survey> = {
  title: 'new survey',
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
}: Partial<Survey>): typeof newSurveyData => ({
  title,
  isPublic,
  archived,
  categories,
  amountOfQuestions,
});

let categoryData = {
  title: 'aaaa',
  trends: [],
};

const surveyWithCategory = (categories: any[] = []) => ({
  title: 'new survey',
  isPublic: false,
  archived: false,
  categories,
  amountOfQuestions: 0,
});

jest.setTimeout(10000);

describe('Company controller (e2e)', () => {
  let app: INestApplication;
  let userModel: any;
  let surveyModel: any;
  let user: User;
  let survey: Partial<Survey>;
  let surveyId: string;
  let categoryId: string;

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

  const createSurvey = async (survey): Promise<Survey> => {
    const newSurvey = await surveyModel.create(survey);
    await newSurvey.save();
    return newSurvey;
  };

  const removeSurvey = async (surveyId: string): Promise<Survey> => {
    return await surveyModel.findOneAndDelete({ _id: surveyId });
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
            name: Survey.name,
            schema: SurveySchema,
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = await moduleFixture.get(getModelToken(User.name));
    surveyModel = await moduleFixture.get(getModelToken(Survey.name));

    survey = await createSurvey(newSurveyData);
    surveyId = new mongoose.Types.ObjectId(survey._id).toString();
    survey = getSurvey(survey);

    user = await createUser(usersData[0] as CreateUserDto);
  });

  afterAll(async () => {
    await removeSurvey(surveyId);
    await removeUser(user._id);
    await mongoose.connection.close(true);
    await app.close();
  });

  describe('POST /surveys/:surveyId/categories', () => {
    it('returns survey with new category', async () => {
      return await request(app.getHttpServer())
        .post(`/surveys/${surveyId}/categories`)
        .send({ title: categoryData.title })
        .expect(201)
        .then(({ body }) => {
          expect(body.categories.length).toBe(1);
          expect(getSurvey(body)).toMatchObject(
            surveyWithCategory([categoryData]),
          );
          return body.categories[0];
        })
        .then((category) => {
          categoryId = new mongoose.Types.ObjectId(category._id).toString();
        });
    });
  });

  describe('PATCH /surveys/:surveyId/categories - update category by id', () => {
    it('returns survey with updated category', async () => {
      const updateData = {
        title: 'bbbb',
      };
      return await request(app.getHttpServer())
        .patch(`/surveys/${surveyId}/categories/${categoryId}`)
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          expect(body.categories.length).toBe(1);
          categoryData = { ...categoryData, ...updateData };
          expect(getSurvey(body)).toMatchObject(
            surveyWithCategory([categoryData]),
          );
        });
    });
  });

  describe('DELETE /surveys/:surveyId/categories - remove category by id', () => {
    it('removes category', async () => {
      return await request(app.getHttpServer())
        .delete(`/surveys/${surveyId}/categories/${categoryId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.categories.length).toBe(0);
          expect(getSurvey(body)).toMatchObject(surveyWithCategory([]));
        });
    });
  });
});
