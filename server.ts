import express from 'express';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
console.log('Starting server...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Настраиваем CORS
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Настраиваем статику
app.use(express.static(path.join(__dirname, 'dist')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
  console.log('Received chat request:', req.body);
  
  try {
    if (!req.body.messages) {
      console.log('No messages in request body');
      return res.status(400).json({ error: 'Messages are required' });
    }

    console.log('Creating OpenAI chat completion...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `Ты HR-ассистент, который помогает с задачами по управлению персоналом. 
          Ты можешь помочь с:
          - Анализом резюме
          - Созданием описаний вакансий
          - Генерацией HR-документов
          - Ответами на вопросы по HR-политикам
          
          Отвечай на русском языке.`
        },
        ...req.body.messages
      ]
    });
    console.log('OpenAI response received');

    // Настраиваем заголовки для SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    let fullResponse = '';
    
    // Обрабатываем поток напрямую
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        console.log('Sending chunk:', content);
        res.write(content);
      }
    }

    console.log('Full response:', fullResponse);
    console.log('Stream finished');
    res.end();
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

// Обработка всех остальных маршрутов - отдаем index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3001; // Фиксируем порт
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 