import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Company } from 'team-fingerprints-common';
import {
  FilterTemplateSchema,
  FilterTemplateModel,
} from './filter-template.model';
import { TeamModel, TeamSchema } from './team.model';

@Schema({ collection: 'companies', autoIndex: false, timestamps: true })
export class CompanyModel extends Document implements Company {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ default: '' })
  description?: string;

  @ApiProperty()
  @Prop({ default: '' })
  pointColor: string;

  @ApiProperty()
  @Prop({ default: '' })
  pointShape: string;

  @ApiProperty()
  @Prop({ type: [TeamSchema], default: [], required: true })
  teams: TeamModel[];

  @ApiProperty()
  @Prop({ default: '', required: false, unique: true })
  domain: string;

  @ApiProperty()
  @Prop({ type: [FilterTemplateSchema], default: [], required: false })
  filterTemplates: FilterTemplateModel[];
}

export const CompanySchema = SchemaFactory.createForClass(CompanyModel);
