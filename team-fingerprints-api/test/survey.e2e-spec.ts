import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Survey } from 'src/survey/models/survey.model';

describe('SurveyController', () => {
  let app: INestApplication;
  let surveyModel: Model<Survey>;

  beforeEach(async () => {
    app = await getApplication();
    surveyModel = app.get(getModelToken(Survey.name));
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
});
