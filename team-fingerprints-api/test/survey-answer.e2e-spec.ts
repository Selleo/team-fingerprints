import { INestApplication } from '@nestjs/common';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Model, Types } from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import { getModelToken } from '@nestjs/mongoose';
import { UserSurveyAnswerI } from 'src/users/interfaces/user.interface';
import { SurveyCompleteStatus } from 'src/survey-answer/survey-answer.type';
import { User } from 'src/users/models/user.model';
import { getBaseUser } from './helpers/getBaseUser';
import { QuestionAnswerDto } from 'src/survey-answer/dto/question-answer.dto';

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
              primary: false,
            },
          ],
        },
      ],
    },
  ],
};

const createSurvey = async (
  surveyModel: Model<Survey>,
  surveyData: Partial<Survey>,
): Promise<Survey> => {
  return await (await surveyModel.create(surveyData)).save();
};

const surveyAnswersData = (survey: Survey): UserSurveyAnswerI => ({
  surveyId: survey._id.toString(),
  completeStatus: SurveyCompleteStatus.PENDING,
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
  surveyResult: [{}],
});

const saveAnswersInUser = async (
  userModel: Model<User>,
  baseUser: User,
  survey: Survey,
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
  let surveyModel: Model<Survey>;
  let userModel: Model<User>;
  let survey: Survey;
  let baseUser: User;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(Survey.name));
    userModel = app.get(getModelToken(User.name));
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
      expect(surveysAnswers[0].completeStatus).toEqual(
        SurveyCompleteStatus.PENDING,
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
      expect(surveysAnswers[0].completeStatus).toEqual(
        SurveyCompleteStatus.PENDING,
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
      expect(surveysAnswers[0].completeStatus).toEqual(
        SurveyCompleteStatus.PENDING,
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
        expect(surveysAnswers[0].completeStatus).toEqual(
          SurveyCompleteStatus.PENDING,
        );
      });
    });
  });
});
