import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Team } from 'team-fingerprints-common';
import {
  FilterTemplateModel,
  FilterTemplateSchema,
} from './filter-template.model';

@Schema({ autoIndex: false })
export class TeamModel implements Team {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  description?: string;

  @ApiProperty()
  @Prop({ default: '' })
  pointShape: string;

  @ApiProperty()
  @Prop({ default: '' })
  pointColor: string;

  @ApiProperty()
  @Prop({ type: [FilterTemplateSchema], default: [], required: false })
  filterTemplates: FilterTemplateModel[];
}
export const TeamSchema = SchemaFactory.createForClass(TeamModel);
