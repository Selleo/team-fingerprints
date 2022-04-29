import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { SurveyModel } from './../survey/models/survey.model';
import { UserModel } from '../users/models/user.model';
import { SurveyModelMock, findById } from '../../test/mocks/survey.model.mock';
import { UserModelMock, findOne } from '../../test/mocks/user.model.mock';
import { SurveySummarizeService } from './survey-summarize.service';

const survey: Partial<SurveyModel> = {
  _id: new Types.ObjectId(),
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

const surveyAnswersDataForBaseUser = {
  surveyId: survey._id.toString(),

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
};

const user = {
  _id: new Types.ObjectId(),
  authId: 'google-sdw4rsdfvwfwr',
  firstName: 'Kinny',
  lastName: 'Zimmer',
  email: 'kinnyzimmer@gmail.com',
  inCompany: true,
  surveysAnswers: [surveyAnswersDataForBaseUser],
  userDetails: [],
  pictureUrl: 'sss',
};

describe('SurveySummarizeService', () => {
  let service: SurveySummarizeService;

  beforeEach(async () => {
    const testingModule = Test.createTestingModule({
      providers: [
        SurveySummarizeService,
        {
          provide: getModelToken(UserModel.name),
          useValue: new UserModelMock(),
        },
        {
          provide: getModelToken(SurveyModel.name),
          useValue: new SurveyModelMock(),
        },
      ],
    });

    const compiledModule = await testingModule.compile();
    const app = compiledModule.createNestApplication();
    service = app.get<SurveySummarizeService>(SurveySummarizeService);
  });

  it('returns counted points', async () => {
    findOne.mockReturnValue(Promise.resolve(user));
    findById.mockReturnValue(Promise.resolve(survey));

    const result = (
      await service.countPointsForUser(
        user._id.toString(),
        survey._id.toString(),
      )
    )[0];

    expect(result.categoryTitle).toEqual(survey.categories[0].title);
    expect(result.categoryId).toEqual(survey.categories[0]._id.toString());
    expect(result.avgTrends.length).toBe(1);
    expect(result.avgTrends[0].trendId).toEqual(
      survey.categories[0].trends[0]._id.toString(),
    );
    expect(result.avgTrends[0].trendPrimary).toEqual(
      survey.categories[0].trends[0].primary,
    );
    expect(result.avgTrends[0].trendSecondary).toEqual(
      survey.categories[0].trends[0].secondary,
    );
    expect(result.avgTrends[0].avgTrendAnswer).toEqual(2);
  });
});
