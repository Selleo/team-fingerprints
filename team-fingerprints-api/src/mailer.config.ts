import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export default {
  transport: `smtp://admin123:admin456@localhost:2500`,
  defaults: {
    from: 'admin@test.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
