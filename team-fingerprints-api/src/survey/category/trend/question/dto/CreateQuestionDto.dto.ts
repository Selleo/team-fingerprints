import mongoose from 'mongoose';

export class CreateQuestionDto {
  surveyId: mongoose.Types.ObjectId;
  data: {
    title: string;
    primary: boolean;
  };
}
