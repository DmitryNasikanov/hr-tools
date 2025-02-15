# HR Tools

Интерактивный HR-ассистент с искусственным интеллектом для автоматизации HR-процессов.

## Возможности

- Анализ резюме кандидатов
- Создание описаний вакансий
- Генерация HR-документов (приказы, письма, отчеты)
- Ответы на вопросы по HR-политикам и процедурам

## Технологии

- React + TypeScript
- Tailwind CSS
- Express.js
- OpenAI GPT-4
- Docker

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone [URL репозитория]
cd hr-tools
```

2. Создайте файл .env и добавьте необходимые переменные окружения:
```
OPENAI_API_KEY=your_api_key
```

3. Запустите через Docker:
```bash
docker compose up
```

Или установите зависимости и запустите локально:
```bash
npm install
npm run dev
```

Приложение будет доступно по адресу:
- Frontend: http://localhost:3002
- Backend: http://localhost:3001

## Разработка

Проект использует:
- Vite для быстрой разработки
- ESLint и TypeScript для статического анализа кода
- Tailwind CSS для стилизации
- Docker для контейнеризации

## Структура проекта

```
hr-tools/
├── src/
│   ├── components/    # React компоненты
│   ├── api/          # API endpoints
│   └── types/        # TypeScript типы
├── server.ts         # Express сервер
├── vite.config.ts    # Конфигурация Vite
└── docker-compose.yml
``` 