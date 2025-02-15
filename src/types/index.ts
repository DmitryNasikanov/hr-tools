import { z } from 'zod';

// Базовые схемы для HR-документов
export const EmployeeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  position: z.string(),
  department: z.string(),
  startDate: z.string(),
  skills: z.array(z.string()),
  performance: z.array(z.object({
    period: z.string(),
    rating: z.number(),
    notes: z.string()
  })).optional()
});

export const JobDescriptionSchema = z.object({
  title: z.string(),
  department: z.string(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  benefits: z.array(z.string()).optional()
});

export const DocumentGenerationSchema = z.object({
  type: z.enum(['offer_letter', 'review', 'report', 'plan']),
  context: z.record(z.string(), z.any()),
  template: z.string().optional()
});

// Типы для API запросов
export interface HRRequest {
  action: 'analyze' | 'generate' | 'search' | 'summarize';
  documentType: 'resume' | 'job_description' | 'review' | 'report';
  content: string | Record<string, any>;
  options?: Record<string, any>;
}

export interface HRResponse {
  success: boolean;
  data: any;
  analysis?: {
    confidence: number;
    suggestions?: string[];
    warnings?: string[];
  };
}

// Типы для системных сообщений
export type SystemPrompt = {
  role: 'system';
  content: string;
  context?: {
    company_policies?: string[];
    templates?: Record<string, string>;
    constraints?: Record<string, any>;
  };
}

export type HRFunction = {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: (params: any) => Promise<any>;
} 