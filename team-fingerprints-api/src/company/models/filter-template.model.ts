import { Prop, SchemaFactory, Schema, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DetailQuery, FilterTemplate } from 'team-fingerprints-common';

@Schema()
export class FilterTemplateModel implements FilterTemplate {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  surveyId: string;

  @ApiProperty()
  @Prop({ default: '' })
  pointShape: string;

  @ApiProperty()
  @Prop({ default: '' })
  pointColor: string;

  @ApiProperty()
  @Prop({ default: true })
  visible: boolean;

  @ApiProperty()
  @Prop(raw({}))
  filters: DetailQuery;
}
export const FilterTemplateSchema =
  SchemaFactory.createForClass(FilterTemplateModel);
