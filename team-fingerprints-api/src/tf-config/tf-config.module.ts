import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TfConfig, TfConfigSchema } from './models/tf-config.model';
import { TfConfigService } from './tf-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TfConfig.name,
        schema: TfConfigSchema,
      },
    ]),
  ],
  providers: [TfConfigService],
  exports: [TfConfigService],
})
export class TfConfigModule {}
