// src/types.ts
export interface Resource {
  type: string;
  title: string;
  url: string;
}

export interface Stage {
  id: number | string;
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
  branch?: 'main' | 'ai' | 'hardware'; // خاصية التشعب الجديدة
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}