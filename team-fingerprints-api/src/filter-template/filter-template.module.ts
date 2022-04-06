import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/models/company.model';
import { RoleModule } from 'src/role/role.module';
import { FilterTemplateController } from './filter-template.controller';
import { FilterTemplateService } from './filter-template.service';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
  controllers: [FilterTemplateController],
  providers: [FilterTemplateService],
})
export class FilterTemplateModule {}
