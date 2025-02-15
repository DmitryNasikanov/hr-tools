import { useEffect, useState, FormEvent } from 'react'
import '../index.css'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
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
    {
      role: 'assistant',
      content: `Здравствуйте! Я HR-ассистент, готовый помочь вам с различными задачами:

• Анализ резюме кандидатов
• Создание описаний вакансий
• Генерация HR-документов (приказы, письма, отчеты)
• Ответы на вопросы по HR-политикам и процедурам

Просто напишите, с чем вам помочь, и я постараюсь предоставить максимально полезную информацию.`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error('Ошибка сети')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Не удалось получить ответ')

      let assistantMessage = { role: 'assistant' as const, content: '' }
      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        assistantMessage.content += text
        setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Произошла ошибка'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="messages-container mb-20">
        {error && (
          <div className="error-message">
            Произошла ошибка: {error.message}
          </div>
        )}
        {messages.slice(1).map((m, i) => (
          <div key={i} className={`message ${m.role === 'user' ? 'user-message' : 'assistant-message'}`}>
            <div className="font-bold mb-2">{m.role === 'user' ? 'Вы:' : 'Ассистент:'}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            Печатаю ответ...
          </div>
        )}
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишите сообщение..."
            className="message-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  )
} 