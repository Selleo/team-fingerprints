import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';
import { Survey } from 'src/survey/models/survey.model';
import { UserSurveyAnswerI } from 'src/users/interfaces/user.interface';
import { User } from 'src/users/models/user.model';
import { getApplication } from './helpers/getApplication';
import { getBaseUser } from './helpers/getBaseUser';
import { createBaseUser } from './helpers/users';
import * as request from 'supertest';
import { Company } from 'src/company/models/company.model';
import { Role } from 'src/role/models/role.model';
import { Team } from 'src/company/models/team.model';
import {
  filtersWithValuesData,
  companyWithTeamData,
  surveyData,
  addUserToTeam,
  createSurvey,
} from './survey-result-filter.setup';

const createCompanyWithTeam = async (
  companyModel: Model<Company>,
  data: any,
): Promise<Company> => {
  return await (await companyModel.create(data)).save();
};

const surveyAnswersDataForBaseUser = (survey: Survey): UserSurveyAnswerI => ({
  surveyId: survey._id.toString(),
  completeStatus: SurveyCompleteStatus.FINISHED,
  amountOfAnswers: 2,
  answers: [
    {
      value: 1,
      questionId: survey.categories[0].trends[0].questions[0]._id.toString(),
    },
    {
      value: 3,
      questionId: survey.categories[0].trends[0].questions[1]._id.toString(),
    },
  ],
  surveyResult: [
    {
      categoryTitle: survey.categories[0].title,
      categoryId: survey.categories[0]._id.toString(),
      avgTrends: [
        {
          trendId: survey.categories[0].trends[0]._id.toString(),
          trendPrimary: survey.categories[0].trends[0].primary,
          trendSecondary: survey.categories[0].trends[0].secondary,
          avgTrendAnswer: 2,
        },
      ],
    },
  ],
});

const surveyAnswersDataForUser = (survey: Survey): UserSurveyAnswerI => ({
  surveyId: survey._id.toString(),
  completeStatus: SurveyCompleteStatus.FINISHED,
  amountOfAnswers: 2,
  answers: [
    {
      value: 2,
      questionId: survey.categories[0].trends[0].questions[0]._id.toString(),
    },
    {
      value: 4,
      questionId: survey.categories[0].trends[0].questions[1]._id.toString(),
    },
  ],
  surveyResult: [
    {
      categoryTitle: survey.categories[0].title,
      categoryId: survey.categories[0]._id.toString(),
      avgTrends: [
        {
          trendId: survey.categories[0].trends[0]._id.toString(),
          trendPrimary: survey.categories[0].trends[0].primary,
          trendSecondary: survey.categories[0].trends[0].secondary,
          avgTrendAnswer: 3,
        },
      ],
    },
  ],
});

const saveAnswersInUser = async (
  userModel: Model<User>,
  user: User,
  surveyAnswerData: UserSurveyAnswerI,
) => {
  return await userModel
    .findOneAndUpdate(
      { _id: user._id.toString() },
      {
        $push: {
          surveysAnswers: surveyAnswerData,
        },
      },
      { new: true },
    )
    .exec();
};

const userDatailsData = [
  {
    country: filtersWithValuesData[0].values[0]._id.toString(),
    level: filtersWithValuesData[1].values[0]._id.toString(),
  },
  {
    country: filtersWithValuesData[0].values[1]._id.toString(),
    level: filtersWithValuesData[1].values[1]._id.toString(),
  },
];

const saveDetailsInUser = async (
  userModel: Model<User>,
  userId: string,
  userDetails: any,
) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { userDetails },
    { new: true },
  );
};

const getUserById = async (userModel: Model<User>, userId: string) => {
  return await userModel.findById(userId).exec();
};

describe('SurveyResultController', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let companyModel: Model<Company>;
  let roleModel: Model<Role>;
  let surveyModel: Model<Survey>;

  let baseUser: User;
  let user: User;
  let company1: Company;
  let company2: Company;
  let team1: Team;
  let team2: Team;
  let survey: Survey;

  beforeEach(async () => {
    app = await getApplication();
    userModel = app.get(getModelToken(User.name));
    companyModel = app.get(getModelToken(Company.name));
    roleModel = app.get(getModelToken(Role.name));
    surveyModel = app.get(getModelToken(Survey.name));

    baseUser = await getBaseUser(userModel);
    user = await createBaseUser(userModel);

    company1 = await createCompanyWithTeam(
      companyModel,
      companyWithTeamData[0],
    );

    company2 = await createCompanyWithTeam(
      companyModel,
      companyWithTeamData[1],
    );

    team1 = company1.teams[0];
    team2 = company2.teams[0];

    await addUserToTeam(
      roleModel,
      baseUser,
      company1._id.toString(),
      team1._id.toString(),
    );

    await addUserToTeam(
      roleModel,
      user,
      company2._id.toString(),
      team2._id.toString(),
    );

    survey = await createSurvey(surveyModel, surveyData);

    let userAnswerData = surveyAnswersDataForBaseUser(survey);
    await saveAnswersInUser(userModel, baseUser, userAnswerData);

    userAnswerData = surveyAnswersDataForUser(survey);
    await saveAnswersInUser(userModel, user, userAnswerData);

    await saveDetailsInUser(
      userModel,
      baseUser._id.toString(),
      userDatailsData[0],
    );

    await saveDetailsInUser(userModel, user._id.toString(), userDatailsData[1]);

    baseUser = await getUserById(userModel, baseUser._id.toString());
    user = await getUserById(userModel, user._id.toString());
  });

  describe('GET /survey-results/:surveyId/companies/:companyId/teams/:teamId/users/:userId - get survey results for user in team', () => {
    it('returns survey results for user', async () => {
      const user1 = await request(app.getHttpServer())
        .get(
          `/survey-results/${survey._id.toString()}/companies/${company1._id.toString()}/teams/${team1._id.toString()}/users/${baseUser._id.toString()}`,
        )
        .expect(200);

      const user2 = await request(app.getHttpServer())
        .get(
          `/survey-results/${survey._id.toString()}/companies/${company2._id.toString()}/teams/${team2._id.toString()}/users/${user._id.toString()}`,
        )
        .expect(200);

      expect(user1.body[0].avgTrends).toMatchObject(
        surveyAnswersDataForBaseUser(survey).surveyResult[0].avgTrends,
      );
      expect(user2.body[0].avgTrends).toMatchObject(
        surveyAnswersDataForUser(survey).surveyResult[0].avgTrends,
      );
    });
  });

  describe('GET /survey-results/:surveyId/companies/:companyId/teams/:teamId - get survey results for team', () => {
    it('returns survey results for team', async () => {
      const team1Company1 = await request(app.getHttpServer())
        .get(
          `/survey-results/${survey._id.toString()}/companies/${company1._id.toString()}/teams/${team1._id.toString()}`,
        )
        .expect(200);

      const team2Company2 = await request(app.getHttpServer())
        .get(
          `/survey-results/${survey._id.toString()}/companies/${company2._id.toString()}/teams/${team2._id.toString()}`,
        )
        .expect(200);

      expect(
        team1Company1.body[survey.categories[0]._id.toString()].avgTrends,
      ).toMatchObject(
        surveyAnswersDataForBaseUser(survey).surveyResult[0].avgTrends,
      );
      expect(
        team2Company2.body[survey.categories[0]._id.toString()].avgTrends,
      ).toMatchObject(
        surveyAnswersDataForUser(survey).surveyResult[0].avgTrends,
      );
    });
  });

  describe('GET /survey-results/:surveyId/companies/:companyId - get survey results for company', () => {
    it('returns survey results for company', async () => {
      const cmpny1 = await request(app.getHttpServer())
        .get(
          `/survey-results/${survey._id.toString()}/companies/${company1._id.toString()}`,
        )
        .expect(200);

      const cmpny2 = await request(app.getHttpServer())
        .get(
          `/survey-results/${survey._id.toString()}/companies/${company2._id.toString()}`,
        )
        .expect(200);

      expect(
        cmpny1.body[survey.categories[0]._id.toString()].avgTrends,
      ).toMatchObject(
        surveyAnswersDataForBaseUser(survey).surveyResult[0].avgTrends,
      );
      expect(
        cmpny2.body[survey.categories[0]._id.toString()].avgTrends,
      ).toMatchObject(
        surveyAnswersDataForUser(survey).surveyResult[0].avgTrends,
      );
    });
  });

  describe('GET /survey-results/:surveyId/companies - get survey results for companies', () => {
    it('returns survey results for companies', async () => {
      const companies = await request(app.getHttpServer())
        .get(`/survey-results/${survey._id.toString()}/companies`)
        .expect(200);

      expect(
        companies.body[survey.categories[0]._id.toString()].avgTrends[0]
          .avgTrendAnswer,
      ).toBe(2.5);
    });
  });
});
