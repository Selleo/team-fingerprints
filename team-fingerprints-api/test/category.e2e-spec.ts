import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { CreateCategoryDto } from 'src/survey/category/dto/category.dto';

const createSurvey = async (surveyModel: Model<Survey>): Promise<Survey> => {
  return await (await surveyModel.create({ title: 'Test survey' })).save();
};

describe('CategoryController', () => {
  let app: INestApplication;
  let surveyModel: Model<Survey>;
  let survey: Survey;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(Survey.name));
    survey = await createSurvey(surveyModel);
  });

  describe('POST /surveys/:surveyId/categories - add category to survey', () => {
    it('returns survey with new category', async () => {
      const categoryData: CreateCategoryDto = {
        title: 'Test category',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/surveys/${survey._id.toString()}/categories`)
        .send(categoryData)
        .expect(201);

      const { categories } = body;

      expect(categories.length).toBe(1);
      expect(categories[0].title).toEqual(categoryData.title);
      expect(categories[0].trends.length).toBe(0);
    });
  });

  describe('PATCH /surveys/:surveyId/categories - update category in survey', () => {
    it('returns survey with updated category', async () => {
      const categoryData: CreateCategoryDto = {
        title: 'Test category',
      };

      const updateCategoryData: CreateCategoryDto = {
        title: 'Test category - updated',
      };

      const res = await request(app.getHttpServer())
        .post(`/surveys/${survey._id.toString()}/categories`)
        .send(categoryData)
        .expect(201);

      const { categories } = res.body;

      const { body } = await request(app.getHttpServer())
        .patch(
          `/surveys/${survey._id.toString()}/categories/${categories[0]._id.toString()}`,
        )
        .send(updateCategoryData)
        .expect(200);

      expect(body.categories.length).toBe(1);
      expect(body.categories[0].title).toEqual(updateCategoryData.title);
      expect(body.categories[0].trends.length).toBe(0);
    });
  });

  describe('DELETE /surveys/:surveyId/categories - remove category from survey', () => {
    it('returns survey without removed category', async () => {
      const categoryData: CreateCategoryDto = {
        title: 'Test category',
      };

      const res = await request(app.getHttpServer())
        .post(`/surveys/${survey._id.toString()}/categories`)
        .send(categoryData)
        .expect(201);

      const { categories } = res.body;

      const { body } = await request(app.getHttpServer())
        .delete(
          `/surveys/${survey._id.toString()}/categories/${categories[0]._id.toString()}`,
        )
        .expect(200);

      expect(body.categories.length).toBe(0);
      expect(body.categories).toEqual([]);
    });
  });
});
