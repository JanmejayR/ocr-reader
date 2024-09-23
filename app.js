import express from 'express';

import { getText } from './controllers/getText.js';
import { getbboxes } from './controllers/getbboxes.js';
const app = express();
app.use(express.json());

app.post('/api/get-text', getText);
app.post('/api/get-bboxes', getbboxes);
  

export default app;
