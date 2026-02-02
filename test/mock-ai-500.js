import express from 'express';
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({status:'healthy'}));
app.post('/analyze', (req, res) => {
  res.status(500).json({error: 'simulated internal server error'});
});
app.listen(8000, () => console.log('Mock AI server (500) running on http://localhost:8000'));
