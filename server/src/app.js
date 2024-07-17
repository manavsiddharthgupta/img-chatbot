import express from 'express';
import cors from 'cors';
import imgAnalysisRouter from './imganalysis.js';
import connectToDatabase from '../lib/db.js';
const app = express();
const port = 3002;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', imgAnalysisRouter);

connectToDatabase().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}🚀`);
});
