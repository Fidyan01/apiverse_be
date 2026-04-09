import express, { json } from 'express';
import { runTest, analyze } from './service/loadTestingService.js';
const app = express();

app.use(json());





app.post('/run-test', async (req, res) => {
  const results = await runTest(req.body);
  const summary = analyze(results);

  res.json(summary);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});