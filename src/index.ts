import express, { Request, Response } from 'express';
import cors from 'cors';
import { HRAgent } from './agents/hr-agent';
import { HRRequest } from './types';

const app = express();
app.use(cors());
app.use(express.json());

// Инициализация HR-агента
const hrAgent = new HRAgent(process.env.OPENAI_API_KEY || '');

// API endpoints
app.post('/api/hr/process', async (req: Request<{}, {}, HRRequest>, res: Response) => {
  try {
    const result = await hrAgent.processRequest(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error processing HR request:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Пример анализа резюме
app.post('/api/hr/analyze-resume', async (req: Request, res: Response) => {
  try {
    const result = await hrAgent.processRequest({
      action: 'analyze',
      documentType: 'resume',
      content: req.body.resume
    });
    res.json(result);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Пример создания описания вакансии
app.post('/api/hr/create-job-description', async (req: Request, res: Response) => {
  try {
    const result = await hrAgent.processRequest({
      action: 'generate',
      documentType: 'job_description',
      content: req.body
    });
    res.json(result);
  } catch (error) {
    console.error('Error creating job description:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HR Tools API is running on port ${PORT}`);
}); 