import { INestApplication } from '@nestjs/common';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Model, Types } from 'mongoose';
import { SurveyModel } from 'src/survey/models/survey.model';
import { getModelToken } from '@nestjs/mongoose';
import { UserModel } from 'src/users/models/user.model';
import { getBaseUser } from './helpers/getBaseUser';
import { QuestionAnswerDto } from 'src/survey-answer/dto/question-answer.dto';
import {
  UserSurveyAnswer,
  SurveyCompletionStatus,
} from 'team-fingerprints-common';

const surveyData: Partial<SurveyModel> = {
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
              primary: false,
            },
          ],
        },
      ],
    },
  ],
};

const createSurvey = async (
  surveyModel: Model<SurveyModel>,
  surveyData: Partial<SurveyModel>,
): Promise<SurveyModel> => {
  return await (await surveyModel.create(surveyData)).save();
};

const surveyAnswersData = (survey: SurveyModel): UserSurveyAnswer => ({
  surveyId: survey._id.toString(),
  completionStatus: SurveyCompletionStatus.PENDING,
  amountOfAnswers: 2,
  answers: [
    {
      value: 2,
      questionId:
        surveyData.categories[0].trends[0].questions[0]._id.toString(),
    },
    {
      value: 4,
      questionId:
        surveyData.categories[0].trends[0].questions[1]._id.toString(),
    },
  ],
  surveyResult: [],
});

const saveAnswersInUser = async (
  userModel: Model<UserModel>,
  baseUser: UserModel,
  survey: SurveyModel,
) => {
  const surveyAnswerData = surveyAnswersData(survey);
  return await userModel
    .findOneAndUpdate(
      { _id: baseUser._id.toString() },
      {
        $push: {
          surveysAnswers: surveyAnswerData,
        },
      },
      { new: true },
    )
    .exec();
};

describe('SurveyAnswerController', () => {
  let app: INestApplication;
  let surveyModel: Model<SurveyModel>;
  let userModel: Model<UserModel>;
  let survey: SurveyModel;
  let baseUser: UserModel;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(SurveyModel.name));
    userModel = app.get(getModelToken(UserModel.name));
    baseUser = await getBaseUser(userModel);
    survey = await createSurvey(surveyModel, surveyData);
  });

  describe('GET /survey-answers/:surveyId - get current user answers', () => {
    it('returns empty object', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/survey-answers/${survey._id.toString()}`)
        .expect(200);

      expect(body).toEqual({});
    });

    it('returns saved answers', async () => {
      await saveAnswersInUser(userModel, baseUser, survey);

      const { body } = await request(app.getHttpServer())
        .get(`/survey-answers/${survey._id.toString()}`)
        .expect(200);

      expect(body).not.toEqual({});

      const { surveysAnswers } = body;

      expect(surveysAnswers.length).toBe(1);
      expect(surveysAnswers[0].answers.length).toBe(2);
      expect(surveysAnswers[0].amountOfAnswers).toBe(
        surveyAnswersData(survey).amountOfAnswers,
      );
      expect(surveysAnswers[0].completionStatus).toEqual(
        SurveyCompletionStatus.PENDING,
      );
      expect(surveysAnswers[0].surveyId).toEqual(survey._id.toString());
    });
  });

  describe('POST /survey-answers - save user answer', () => {
    it('returns user with new answer', async () => {
      const questionAnswerData: QuestionAnswerDto = {
        questionId: survey.categories[0].trends[0].questions[0]._id.toString(),
        value: 2,
      };

      const { body } = await request(app.getHttpServer())
        .post(`/survey-answers/${survey._id.toString()}`)
        .send(questionAnswerData)
        .expect(201);

      const { surveysAnswers } = body;

      expect(surveysAnswers.length).toBe(1);
      expect(surveysAnswers[0].answers.length).toBe(1);
      expect(surveysAnswers[0].answers[0].questionId).toEqual(
        questionAnswerData.questionId,
      );
      expect(surveysAnswers[0].answers[0].value).toEqual(
        questionAnswerData.value,
      );
      expect(surveysAnswers[0].amountOfAnswers).toBe(1);
      expect(surveysAnswers[0].completionStatus).toEqual(
        SurveyCompletionStatus.PENDING,
      );
      expect(surveysAnswers[0].surveyId).toEqual(survey._id.toString());
    });

    it('returns user with updated answer', async () => {
      await saveAnswersInUser(userModel, baseUser, survey);

      const changeQuestionAnswerData: QuestionAnswerDto = {
        questionId: survey.categories[0].trends[0].questions[0]._id.toString(),
        value: 5,
      };

      const { body } = await request(app.getHttpServer())
        .post(`/survey-answers/${survey._id.toString()}`)
        .send(changeQuestionAnswerData)
        .expect(201);

      expect(body).not.toEqual({});

      const { surveysAnswers } = body;

      expect(surveysAnswers.length).toBe(1);
      expect(surveysAnswers[0].answers.length).toBe(2);
      expect(surveysAnswers[0].amountOfAnswers).toBe(2);
      expect(surveysAnswers[0].completionStatus).toEqual(
        SurveyCompletionStatus.PENDING,
      );
      expect(surveysAnswers[0].surveyId).toEqual(survey._id.toString());
      expect(surveysAnswers[0].answers[0].questionId).toEqual(
        changeQuestionAnswerData.questionId,
      );
      expect(surveysAnswers[0].answers[0].value).toEqual(
        changeQuestionAnswerData.value,
      );
    });

    describe('Uncheck answer', () => {
      it('returns user without unchecked answer', async () => {
        await saveAnswersInUser(userModel, baseUser, survey);

        const changeQuestionAnswerData: QuestionAnswerDto = {
          questionId:
            survey.categories[0].trends[0].questions[0]._id.toString(),
          value: 0,
        };

        const { body } = await request(app.getHttpServer())
          .post(`/survey-answers/${survey._id.toString()}`)
          .send(changeQuestionAnswerData)
          .expect(201);

        expect(body).not.toEqual({});

        const { surveysAnswers } = body;

        expect(surveysAnswers.length).toBe(1);
        expect(surveysAnswers[0].answers.length).toBe(1);
        expect(surveysAnswers[0].amountOfAnswers).toBe(1);
        expect(surveysAnswers[0].completionStatus).toEqual(
          SurveyCompletionStatus.PENDING,
        );
      });
    });
  });

  describe('POST /survey-answers/:surveyId/finish - sign survey as finished and get calculated result', () => {
    it('changes surver complete status to finished and returns calculated result', async () => {
      await saveAnswersInUser(userModel, baseUser, survey);

      const { body } = await request(app.getHttpServer())
        .post(`/survey-answers/${survey._id.toString()}/finish`)
        .expect(201);

      const { surveysAnswers } = await userModel.findById(
        baseUser._id.toString(),
      );

      expect(body).toBeDefined();
      expect(body).not.toEqual({});
      expect(surveysAnswers[0].completionStatus).toEqual(
        SurveyCompletionStatus.FINISHED,
      );
    });
  });
});
