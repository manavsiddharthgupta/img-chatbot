import express from 'express';
import imgAnalysisRouter from './imganalysis.js';
import connectToDatabase from '../lib/db.js';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', imgAnalysisRouter);

connectToDatabase().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}🚀`);
});
