import { Model } from 'mongoose';
import { Factory } from 'rosie';

export async function createDocument<T extends Document>(
  ctor: new () => T,
  model: Model<T>,
  params: Partial<T>,
) {
  const object = Factory.build<T>(ctor.name, params);
  const newDoc = await model.create(object);
  return await newDoc.save();
}
