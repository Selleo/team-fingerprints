import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { SurveyModel } from 'src/survey/models/survey.model';
import { UpdateSurveyDto } from 'src/survey/dto/survey.dto';

describe('SurveyController', () => {
  let app: INestApplication;
  let surveyModel: Model<SurveyModel>;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(SurveyModel.name));
  });

  describe('GET /surveys - get surveys with complete status for current user', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/surveys')
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one survey', async () => {
      const surveyData = {
        title: 'Test survey',
        isPublic: true,
      };
      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const { body } = await request(app.getHttpServer())
        .get('/surveys')
        .expect(200);

      expect(body.length).toBe(1);

      const {
        _id,
        title,
        completeStatus,
        isPublic,
        archived,
        amountOfQuestions,
        categories,
      } = body[0];

      expect(_id).toEqual(newSurvey._id.toString());
      expect(title).toBe(newSurvey.title);
      expect(completeStatus).toEqual('new');
      expect(isPublic).toBe(true);
      expect(archived).toBe(false);
      expect(amountOfQuestions).toBe(0);
      expect(categories).toEqual([]);
    });
  });

  describe('GET /surveys/public - get public surveys', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/surveys/public')
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one survey', async () => {
      const surveyData = {
        title: 'Test survey',
        isPublic: true,
      };
      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const { body } = await request(app.getHttpServer())
        .get('/surveys/public')
        .expect(200);

      expect(body.length).toBe(1);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body[0];

      expect(_id).toEqual(newSurvey._id.toString());
      expect(title).toBe(newSurvey.title);
      expect(isPublic).toBe(true);
      expect(archived).toBe(false);
      expect(amountOfQuestions).toBe(0);
      expect(categories).toEqual([]);
    });
  });

  describe('GET /surveys/:surveyId/public - get public survey by id', () => {
    it('returns survey', async () => {
      const surveyData = {
        title: 'Test survey',
        isPublic: true,
      };
      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const { body } = await request(app.getHttpServer())
        .get(`/surveys/${newSurvey._id.toString()}/public`)
        .expect(200);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body;

      expect(_id).toEqual(newSurvey._id.toString());
      expect(title).toBe(newSurvey.title);
      expect(isPublic).toBe(true);
      expect(archived).toBe(false);
      expect(amountOfQuestions).toBe(0);
      expect(categories).toEqual([]);
    });
  });

  describe('GET /surveys/:surveyId - get survey by id', () => {
    it('returns survey', async () => {
      const surveyData = {
        title: 'Test survey',
        isPublic: true,
      };
      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const { body } = await request(app.getHttpServer())
        .get(`/surveys/${newSurvey._id.toString()}`)
        .expect(200);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body;

      expect(_id).toEqual(newSurvey._id.toString());
      expect(title).toBe(newSurvey.title);
      expect(isPublic).toBe(true);
      expect(archived).toBe(false);
      expect(amountOfQuestions).toBe(0);
      expect(categories).toEqual([]);
    });
  });

  describe('POST /surveys - create survey', () => {
    it('returns created survey', async () => {
      const surveyData = {
        title: 'Test survey',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/surveys`)
        .send(surveyData)
        .expect(201);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body;

      expect(_id).toBeDefined();
      expect(title).toBe(surveyData.title);
      expect(isPublic).toBe(false);
      expect(archived).toBe(false);
      expect(amountOfQuestions).toBe(0);
      expect(categories).toEqual([]);
    });
  });

  describe('POST /surveys/:surveyId/duplicate - duplicate existing survey with new title', () => {
    it('returns duplicated survey', async () => {
      const surveyData = {
        title: 'Test survey',
      };

      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const duplicatedSurveyData = {
        title: 'Test survey - copy',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/surveys/${newSurvey._id.toString()}/duplicate`)
        .send(duplicatedSurveyData)
        .expect(201);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body;

      expect(_id).toBeDefined();
      expect(title).toBe(duplicatedSurveyData.title);
      expect(isPublic).toBe(newSurvey.isPublic);
      expect(archived).toBe(newSurvey.archived);
      expect(amountOfQuestions).toBe(newSurvey.amountOfQuestions);
      expect(categories).toEqual(newSurvey.categories);
    });
  });

  describe('PATCH /surveys/:surveyId - update survey', () => {
    it('returns updated survey', async () => {
      const surveyData = {
        title: 'Test survey',
        amountOfQuestions: 1,
      };

      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const updateData: UpdateSurveyDto = {
        title: 'Updated survey',
        isPublic: true,
        archived: true,
      };

      const { body } = await request(app.getHttpServer())
        .patch(`/surveys/${newSurvey._id.toString()}`)
        .send(updateData)
        .expect(200);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body;

      expect(_id).toBeDefined();
      expect(title).toBe(updateData.title);
      expect(isPublic).toBe(updateData.isPublic);
      expect(archived).toBe(updateData.archived);
      expect(amountOfQuestions).toBe(surveyData.amountOfQuestions);
      expect(categories).toEqual([]);
    });
  });

  describe('DELETE /surveys/:surveyId - remove survey', () => {
    it('returns removed survey', async () => {
      const surveyData = {
        title: 'Test survey',
      };

      const newSurvey = await (await surveyModel.create(surveyData)).save();

      const { body } = await request(app.getHttpServer())
        .delete(`/surveys/${newSurvey._id.toString()}`)
        .expect(200);

      const { _id, title, isPublic, archived, amountOfQuestions, categories } =
        body;

      expect(_id).toBeDefined();
      expect(title).toBe(surveyData.title);
      expect(isPublic).toBe(false);
      expect(archived).toBe(false);
      expect(amountOfQuestions).toBe(0);
      expect(categories).toEqual([]);
    });
  });
});
