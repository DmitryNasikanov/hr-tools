import React from 'react';
import { useChat } from 'ai/react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Divider,
  useToast
} from '@chakra-ui/react';

export function HRAssistant() {
  const toast = useToast();
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    },
    initialMessages: [
      {
        role: 'system',
        content: `Ты HR-ассистент, который помогает с задачами по управлению персоналом. 
        Ты можешь помочь с:
        - Анализом резюме
        - Созданием описаний вакансий
        - Генерацией HR-документов
        - Ответами на вопросы по HR-политикам`
      }
    ]
  });

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <VStack spacing={4} align="stretch">
        {/* Чат */}
        <Box 
          borderWidth={1} 
          borderRadius="lg" 
          p={4} 
          minH="400px" 
          maxH="600px" 
          overflowY="auto"
        >
          {messages.map((message, i) => (
            <Box 
              key={i} 
              bg={message.role === 'assistant' ? 'blue.50' : 'gray.50'}
              p={3} 
              borderRadius="md"
              mb={2}
            >
              <Text>
                {message.content}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Форма ввода */}
        <form onSubmit={handleSubmit}>
          <HStack>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Опишите задачу или задайте вопрос..."
              size="lg"
            />
            <Button type="submit" colorScheme="blue" size="lg">
              Отправить
            </Button>
          </HStack>
        </form>

        <Divider />

        {/* Быстрые действия */}
        <Box>
          <Text mb={2} fontWeight="bold">Быстрые действия:</Text>
          <HStack spacing={2}>
            <Button 
              size="sm" 
              onClick={() => handleSubmit({ 
                preventDefault: () => {}, 
                currentTarget: { 
                  reset: () => {} 
                }
              }, "Помоги составить описание вакансии разработчика")}
            >
              Создать вакансию
            </Button>
            <Button 
              size="sm"
              onClick={() => handleSubmit({ 
                preventDefault: () => {}, 
                currentTarget: { 
                  reset: () => {} 
                }
              }, "Как составить план адаптации нового сотрудника?")}
            >
              План адаптации
            </Button>
            <Button 
              size="sm"
              onClick={() => handleSubmit({ 
                preventDefault: () => {}, 
                currentTarget: { 
                  reset: () => {} 
                }
              }, "Какие документы нужны для оформления отпуска?")}
            >
              Оформление отпуска
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
} 