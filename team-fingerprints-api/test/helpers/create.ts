import { Factory } from 'rosie';
import { Document } from 'mongoose';

export async function create<T extends Document>(
  ctor: new () => T,
  attrs: Partial<T>,
) {
  return Factory.build<T>(ctor.name, attrs);
}
