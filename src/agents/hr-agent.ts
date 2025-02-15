import { OpenAI } from 'openai';
import { z } from 'zod';
import { EmployeeSchema, JobDescriptionSchema, DocumentGenerationSchema, HRRequest, HRResponse } from '../types';

export class HRAgent {
  private openai: OpenAI;
  private systemPrompt: string;
  private functions: Record<string, Function>;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.systemPrompt = `Ты HR-ассистент, который помогает автоматизировать HR процессы. 
    Ты умеешь анализировать документы, создавать новые документы и давать рекомендации.
    Ты всегда следуешь корпоративным политикам и сохраняешь конфиденциальность данных.`;
    
    this.initializeFunctions();
  }

  private initializeFunctions() {
    this.functions = {
      analyzeResume: this.analyzeResume.bind(this),
      generateJobDescription: this.generateJobDescription.bind(this),
      createDocument: this.createDocument.bind(this),
      searchEmployees: this.searchEmployees.bind(this)
    };
  }

  async processRequest(request: HRRequest): Promise<HRResponse> {
    try {
      const { action, documentType, content, options } = request;
      
      // Добавляем контекст запроса к системному промпту
      const messages = [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: JSON.stringify({ action, documentType, content, options }) }
      ];

      // Вызываем соответствующую функцию
      const functionName = `${action}${documentType.charAt(0).toUpperCase() + documentType.slice(1)}`;
      if (this.functions[functionName]) {
        return await this.functions[functionName](content, options);
      }

      // Если нет специальной функции, используем общий обработчик
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2000
      });

      return {
        success: true,
        data: response.choices[0].message.content,
        analysis: {
          confidence: 0.9
        }
      };

    } catch (error) {
      console.error('Error in HR Agent:', error);
      return {
        success: false,
        data: null,
        analysis: {
          confidence: 0,
          warnings: [error instanceof Error ? error.message : 'Unknown error']
        }
      };
    }
  }

  // Специализированные функции
  private async analyzeResume(content: string, options?: any): Promise<HRResponse> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'Анализируй резюме и выдели ключевые навыки, опыт и соответствие требованиям.' },
        { role: 'user', content }
      ],
      temperature: 0.3
    });

    return {
      success: true,
      data: response.choices[0].message.content,
      analysis: {
        confidence: 0.85
      }
    };
  }

  private async generateJobDescription(content: Record<string, any>, options?: any): Promise<HRResponse> {
    try {
      // Валидируем входные данные
      const validatedInput = JobDescriptionSchema.parse(content);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Создай детальное описание вакансии на основе предоставленных требований.' },
          { role: 'user', content: JSON.stringify(validatedInput) }
        ],
        temperature: 0.5
      });

      return {
        success: true,
        data: response.choices[0].message.content,
        analysis: {
          confidence: 0.9
        }
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          analysis: {
            confidence: 0,
            warnings: ['Invalid job description format', ...error.errors.map(e => e.message)]
          }
        };
      }
      throw error;
    }
  }

  private async createDocument(content: Record<string, any>, options?: any): Promise<HRResponse> {
    try {
      const validatedInput = DocumentGenerationSchema.parse(content);
      
      // Здесь можно добавить логику выбора шаблона документа
      const template = validatedInput.template || this.getDefaultTemplate(validatedInput.type);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: `Создай документ типа ${validatedInput.type} на основе шаблона.` },
          { role: 'user', content: JSON.stringify({ template, context: validatedInput.context }) }
        ],
        temperature: 0.3
      });

      return {
        success: true,
        data: response.choices[0].message.content,
        analysis: {
          confidence: 0.95
        }
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          analysis: {
            confidence: 0,
            warnings: ['Invalid document generation request', ...error.errors.map(e => e.message)]
          }
        };
      }
      throw error;
    }
  }

  private async searchEmployees(query: string, options?: any): Promise<HRResponse> {
    // Здесь должна быть интеграция с базой данных сотрудников
    return {
      success: true,
      data: [],
      analysis: {
        confidence: 1,
        warnings: ['Search functionality not implemented']
      }
    };
  }

  private getDefaultTemplate(type: string): string {
    // Здесь можно хранить шаблоны документов
    const templates: Record<string, string> = {
      offer_letter: 'Шаблон письма с предложением о работе',
      review: 'Шаблон обзора производительности',
      report: 'Шаблон отчета',
      plan: 'Шаблон плана развития'
    };
    return templates[type] || '';
  }
} 