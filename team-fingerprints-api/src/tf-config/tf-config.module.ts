import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TfConfigModel, TfConfigSchema } from './models/tf-config.model';
import { TfConfigService } from './tf-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TfConfigModel.name,
        schema: TfConfigSchema,
      },
    ]),
  ],
  providers: [TfConfigService],
  exports: [TfConfigService],
})
export class TfConfigModule {}
