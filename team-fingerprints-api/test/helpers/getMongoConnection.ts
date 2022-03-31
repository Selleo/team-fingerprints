import * as mongoose from 'mongoose';

export async function getMongoConnection() {
  const conn = mongoose.createConnection(
    'mongodb+srv://murmeltier:4ixQiIg7p9B5fVGIrAvu@selleo-team-fingerprint.zrkzt.mongodb.net/selleoTeamFingerprint-testing?retryWrites=true&w=majority',
  );

  return conn;
}
