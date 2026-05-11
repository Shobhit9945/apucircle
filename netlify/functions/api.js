import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { connectDB } from '../../server/config/db.js';
import app from '../../server/app.js';

dotenv.config();

let isConnected = false;
const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return serverlessHandler(event, context);
};
