FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package файлы первыми для оптимального кэширования слоев
COPY package*.json ./

# Устанавливаем ВСЕ зависимости
RUN npm install

# Копируем исходный код после установки зависимостей
COPY . .

# Устанавливаем переменные окружения для Node.js
ENV NODE_ENV=development
ENV NODE_OPTIONS=--experimental-vm-modules
ENV HOST=0.0.0.0

# Открываем порты
EXPOSE 3002 3001

# Запускаем в dev режиме
CMD ["npm", "run", "dev"] 