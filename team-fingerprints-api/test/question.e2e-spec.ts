import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from 'src/survey/category/trend/question/dto/question.dto';
import { SurveyModel } from 'src/survey/models/survey.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';

const createSurveyWithTrendInCategory = async (
  surveyModel: Model<SurveyModel>,
): Promise<SurveyModel> => {
  const surveyData = {
    title: 'Test survey',
    categories: [
      {
        _id: new Types.ObjectId(),
        title: 'Test category',
        trends: [
          {
            _id: new Types.ObjectId(),
            primary: 'Primary',
            secondary: 'Secondary',
            questions: [],
          },
        ],
      },
    ],
  };
  return await (await surveyModel.create(surveyData)).save();
};

describe('QuestionController', () => {
  let app: INestApplication;
  let surveyModel: Model<SurveyModel>;
  let survey: SurveyModel;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(SurveyModel.name));
    survey = await createSurveyWithTrendInCategory(surveyModel);
  });

  describe('POST /surveys/:surveyId/categories/:categoryId/trends/:trendId/questions - add new question to trend', () => {
    it('returns survey with new question in trend', async () => {
      const questionData: CreateQuestionDto = {
        title: 'Test question',
        primary: true,
      };

      const surveyId = survey._id.toString();
      const categoryId = survey.categories[0]._id.toString();
      const trendId = survey.categories[0].trends[0]._id.toString();

      const { body } = await request(app.getHttpServer())
        .post(
          `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions`,
        )
        .send(questionData)
        .expect(201);

      const questions = body.categories[0].trends[0].questions;

      expect(questions.length).toBe(1);
      expect(questions[0].title).toEqual(questionData.title);
      expect(questions[0].primary).toEqual(questionData.primary);
    });
  });

  describe('PATCH /surveys/:surveyId/categories/:categoryId/trends/:trendId/questions/:questionId - update question in trend', () => {
    it('returns survey with new question in trend', async () => {
      const questionData: CreateQuestionDto = {
        title: 'Test question',
        primary: true,
      };

      const updateQuestionData: CreateQuestionDto = {
        title: 'Test question - updated',
        primary: false,
      };

      const surveyId = survey._id.toString();
      const categoryId = survey.categories[0]._id.toString();
      const trendId = survey.categories[0].trends[0]._id.toString();

      const res = await request(app.getHttpServer())
        .post(
          `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions`,
        )
        .send(questionData)
        .expect(201);

      const questionId =
        res.body.categories[0].trends[0].questions[0]._id.toString();

      const { body } = await request(app.getHttpServer())
        .patch(
          `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions/${questionId}`,
        )
        .send(updateQuestionData)
        .expect(200);

      const updatedQuestion = body.categories[0].trends[0].questions[0];

      expect(updatedQuestion.title).toEqual(updateQuestionData.title);
      expect(updatedQuestion.primary).toEqual(updateQuestionData.primary);
    });
  });

  describe('DELETE /surveys/:surveyId/categories/:categoryId/trends/:trendId/questions/:questionId - remve question from trend', () => {
    it('returns survey without removed question', async () => {
      const questionData: CreateQuestionDto = {
        title: 'Test question',
        primary: true,
      };

      const surveyId = survey._id.toString();
      const categoryId = survey.categories[0]._id.toString();
      const trendId = survey.categories[0].trends[0]._id.toString();

      const res = await request(app.getHttpServer())
        .post(
          `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions`,
        )
        .send(questionData)
        .expect(201);

      const questionId =
        res.body.categories[0].trends[0].questions[0]._id.toString();

      const { body } = await request(app.getHttpServer())
        .delete(
          `/surveys/${surveyId}/categories/${categoryId}/trends/${trendId}/questions/${questionId}`,
        )
        .expect(200);

      const questions = body.categories[0].trends[0].questions;

      expect(questions.length).toBe(0);
    });
  });
});
