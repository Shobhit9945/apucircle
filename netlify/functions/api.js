import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { connectDB } from '../../server/config/db.js';
import app from '../../server/app.js';

dotenv.config();

let isConnected = false;
const FUNCTION_PREFIX = '/.netlify/functions/api';
const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  if (event.path && event.path.startsWith(FUNCTION_PREFIX)) {
    event.path = '/api' + event.path.slice(FUNCTION_PREFIX.length);
  }
  if (event.rawUrl) {
    event.rawUrl = event.rawUrl.replace(FUNCTION_PREFIX, '/api');
  }

  return serverlessHandler(event, context);
};
