import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';
import { Filter, FilterSchema } from './models/filter.model';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MongooseModule.forFeature([
      {
        name: Filter.name,
        schema: FilterSchema,
      },
    ]),
  ],
  controllers: [FilterController],
  providers: [FilterService],
  exports: [FilterService],
})
export class FilterModule {}
