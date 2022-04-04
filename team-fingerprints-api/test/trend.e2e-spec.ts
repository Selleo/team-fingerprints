import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { CreateTrendDto } from 'src/survey/category/trend/dto/trend.dto';

const createSurveyWithCategory = async (
  surveyModel: Model<Survey>,
): Promise<Survey> => {
  const surveyData = {
    title: 'Test survey',
    categories: [
      {
        _id: new Types.ObjectId(),
        title: 'Test category',
        trends: [],
      },
    ],
  };
  return await (await surveyModel.create(surveyData)).save();
};

describe('TrendController', () => {
  let app: INestApplication;
  let surveyModel: Model<Survey>;
  let survey: Survey;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(Survey.name));
    survey = await createSurveyWithCategory(surveyModel);
  });

  describe('POST /surveys/:surveyId/categories/:categoryId/trends - add new trend to category', () => {
    it('returns survey with category that contains new trend', async () => {
      const { _id, categories } = survey;

      const trendData: CreateTrendDto = {
        primary: 'Primary',
        secondary: 'Secondary',
      };

      const { body } = await request(app.getHttpServer())
        .post(
          `/surveys/${_id.toString()}/categories/${categories[0]._id.toString()}/trends`,
        )
        .send(trendData)
        .expect(201);

      const trends = body.categories[0].trends;

      expect(trends.length).toBe(1);
      expect(trends[0].primary).toEqual(trendData.primary);
      expect(trends[0].secondary).toEqual(trendData.secondary);
    });
  });

  describe('PATCH /surveys/:surveyId/categories/:categoryId/trends/:trendId - update trend in trends', () => {
    it('returns survey with category that contains updated trend', async () => {
      const { _id, categories } = survey;

      const trendData: CreateTrendDto = {
        primary: 'Primary',
        secondary: 'Secondary',
      };

      const updateTrendData: CreateTrendDto = {
        primary: 'Primary - updated',
        secondary: 'Secondary - updated',
      };

      const res = await request(app.getHttpServer())
        .post(
          `/surveys/${_id.toString()}/categories/${categories[0]._id.toString()}/trends`,
        )
        .send(trendData)
        .expect(201);

      const trendId = res.body.categories[0].trends[0]._id.toString();

      const { body } = await request(app.getHttpServer())
        .patch(
          `/surveys/${_id.toString()}/categories/${categories[0]._id.toString()}/trends/${trendId}`,
        )
        .send(updateTrendData)
        .expect(200);

      const updatedTrend = body.categories[0].trends[0];

      expect(updatedTrend.primary).toEqual(updateTrendData.primary);
      expect(updatedTrend.secondary).toEqual(updateTrendData.secondary);
    });
  });
});
