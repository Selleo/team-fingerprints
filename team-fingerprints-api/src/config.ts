import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const envValidaion = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test').default('development'),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().default('mongodb://localhost:27017/surveys'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PASSWORD: Joi.string().default(''),
});

const ENV = process.env.NODE_ENV;

export const configModuleConfig = {
  isGlobal: true,
  envFilePath: ENV ? `.env.${ENV}` : `.env.development`,
  validationSchema: envValidaion,
  validationOptions: {
    abortEarly: true,
  },
};

export const mongooseModuleConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
};

export const bullModuleConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      port: Number(configService.get<string>('REDIS_PORT')),
      host: configService.get<string>('REDIS_HOST'),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
  }),
};
