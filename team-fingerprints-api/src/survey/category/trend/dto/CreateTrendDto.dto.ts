import mongoose from 'mongoose';

export class CreateTrendDto {
  surveyId: mongoose.Types.ObjectId;
  data: {
    primary: string;
    secondary: string;
  };
}
