// src/types.ts
export interface Resource {
    type: string;
    title: string;
    url: string;
  }
  
  export interface Stage {
    id: number;
    title: string;
    icon: any; 
    color: string;
    bgColor: string;
    borderColor: string;
    difficulty: string;
    difficultyColor: string;
    description: string;
    resources: Resource[];
    project: string;
    hint?: string;
  }
  
  export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
  }