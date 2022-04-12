import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
import { RoleType } from 'src/role/role.type';
import { Team } from 'src/company/models/team.model';
import { Filter } from 'src/filter/models/filter.model';

const companyWithTeamData = [
  {
    name: 'Test company - 1',
    pointColor: '#fffaaa',
    pointShape: 'square',
    domain: 'example.com',
    filterTemplates: [],
    teams: [
      {
        _id: new Types.ObjectId(),
        name: 'Test team - 1',
        pointColor: '#fffaaa',
        pointShape: 'square',
        filterTemplates: [],
      },
    ],
  },
  {
    name: 'Test company - 2',
    pointColor: '#222333',
    pointShape: 'circle',
    domain: 'oelles.com',
    filterTemplates: [],
    teams: [
      {
        _id: new Types.ObjectId(),
        name: 'Test team - 2',
        pointColor: '#bbbccc',
        pointShape: 'circle',
        filterTemplates: [],
      },
    ],
  },
];

const surveyData: Partial<Survey> = {
  title: 'Test survey',
  amountOfQuestions: 2,
  isPublic: true,
  archived: false,
  categories: [
    {
      _id: new Types.ObjectId(),
      title: 'Category 1 - test',
      trends: [
        {
          _id: new Types.ObjectId(),
          primary: 'Aaaa - test',
          secondary: 'Bbbb - test',
          questions: [
            {
              _id: new Types.ObjectId(),
              title: 'Jdiokehfjiwebdfvjdbfv?',
              primary: true,
            },
            {
              _id: new Types.ObjectId(),
              title: 'Aadasddfs?',
              primary: true,
            },
          ],
        },
      ],
    },
  ],
};

const filtersWithValuesData = [
  {
    name: 'Country',
    filterPath: 'country',
    values: [
      {
        _id: new Types.ObjectId(),
        value: 'Poland',
      },
      {
        _id: new Types.ObjectId(),
        value: 'Slovakia',
      },
    ],
  },
  {
    name: 'Level',
    filterPath: 'level',
    values: [
      {
        _id: new Types.ObjectId(),
        value: 'Junior',
      },
      {
        _id: new Types.ObjectId(),
        value: 'Independent',
      },
    ],
  },
];

const createCompanyWithTeam = async (
  companyModel: Model<Company>,
  data: any,
): Promise<Company> => {
  return await (await companyModel.create(data)).save();
};

const addUserToTeam = async (
  roleModel: Model<Role>,
  baseUser: User,
  companyId: string,
  teamId: string,
): Promise<Role> => {
  const roleDocumentData: Partial<Role> = {
    role: RoleType.USER,
    companyId,
    teamId,
    email: baseUser.email,
    userId: baseUser._id.toString(),
  };

  return await (await roleModel.create(roleDocumentData)).save();
};

const createSurvey = async (
  surveyModel: Model<Survey>,
  surveyData: Partial<Survey>,
): Promise<Survey> => {
  return await (await surveyModel.create(surveyData)).save();
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

const createFilter = async (filterModel: Model<Filter>, filterData: any) => {
  return await (await filterModel.create(filterData)).save();
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
  let filterModel: Model<Filter>;

  let baseUser: User;
  let user: User;
  let company1: Company;
  let company2: Company;
  let team1: Team;
  let team2: Team;
  let survey: Survey;
  let filterCountry: Filter;
  let filterLevel: Filter;

  beforeEach(async () => {
    app = await getApplication();
    userModel = app.get(getModelToken(User.name));
    companyModel = app.get(getModelToken(Company.name));
    roleModel = app.get(getModelToken(Role.name));
    surveyModel = app.get(getModelToken(Survey.name));
    filterModel = app.get(getModelToken(Filter.name));

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

    filterCountry = await createFilter(filterModel, filtersWithValuesData[0]);
    filterLevel = await createFilter(filterModel, filtersWithValuesData[1]);

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

  describe('GET /survey-results/companies/filters - get available filters for company', () => {
    it('returnsavailable filters for company', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/survey-results/companies/filters`)
        .expect(200);

      expect(body[0].name).toEqual(filterCountry.name);
      expect(body[0].filterPath).toEqual(filterCountry.filterPath);
      expect(body[0]._id).toEqual(filterCountry._id.toString());
      expect(body[0].values[0].value).toEqual(filterCountry.values[0].value);
      expect(body[0].values[0]._id).toEqual(
        filterCountry.values[0]._id.toString(),
      );
      expect(body[0].values[1].value).toEqual(filterCountry.values[1].value);
      expect(body[0].values[1]._id).toEqual(
        filterCountry.values[1]._id.toString(),
      );

      expect(body[1].name).toEqual(filterLevel.name);
      expect(body[1].filterPath).toEqual(filterLevel.filterPath);
      expect(body[1]._id).toEqual(filterLevel._id.toString());
      expect(body[1].values[0].value).toEqual(filterLevel.values[0].value);
      expect(body[1].values[0]._id).toEqual(
        filterLevel.values[0]._id.toString(),
      );
      expect(body[1].values[1].value).toEqual(filterLevel.values[1].value);
      expect(body[1].values[1]._id).toEqual(
        filterLevel.values[1]._id.toString(),
      );
    });
  });
});
