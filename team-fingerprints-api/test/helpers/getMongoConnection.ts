import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env.test' });

export async function getMongoConnection() {
  const conn = mongoose.createConnection(process.env.MONGODB_URI);
  return conn;
}
