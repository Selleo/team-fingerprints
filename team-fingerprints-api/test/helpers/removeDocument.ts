import { Model } from 'mongoose';

export async function removeDocument<T>(
  model: Model<T>,
  searchParams: Partial<T>,
) {
  return await model.findOneAndRemove(searchParams);
}
