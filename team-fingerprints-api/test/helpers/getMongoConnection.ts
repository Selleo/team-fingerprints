import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env.test' });

let conn: mongoose.Connection;

export async function getMongoConnection() {
  if (!conn) {
    conn = mongoose.createConnection(process.env.MONGODB_URI);
  }
  return conn;
}
