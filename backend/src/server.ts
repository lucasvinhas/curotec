import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  try {
    res.send('Hello from the backend!');
  } catch (error) {
    console.error('Failed to query database:', error);
    res.status(500).send('Error connecting to the database');
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
}); 