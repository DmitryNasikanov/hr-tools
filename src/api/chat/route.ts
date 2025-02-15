import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Создаем клиент OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  // Получаем сообщения из запроса
  const { messages } = await req.json()

  // Запрашиваем ответ от OpenAI
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
      ...messages
    ]
  })

  // Создаем стрим для ответа
  const stream = OpenAIStream(response)

  // Возвращаем стриминг-ответ
  return new StreamingTextResponse(stream)
} 