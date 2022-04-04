import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from 'src/survey/category/trend/question/dto/question.dto';
import { Survey } from 'src/survey/models/survey.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';

const createSurveyWithTrendInCategory = async (
  surveyModel: Model<Survey>,
): Promise<Survey> => {
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
  let surveyModel: Model<Survey>;
  let survey: Survey;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(Survey.name));
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
});
