import mongoose from 'mongoose';

export class CreateCategoryDto {
  surveyId: mongoose.Types.ObjectId;
  data: {
    title: string;
  };
}
