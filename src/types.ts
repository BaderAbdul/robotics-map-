// src/types.ts
export interface Resource {
  type: string;
  title: string;
  url: string;
}
 
// src/types.ts

export interface Stage {
  id: string | number;
  title: string;
  description: string;
  icon: any; 
  bgColor: string;
  color: string;
  difficulty: string;
  difficultyColor: string;
  // أضفنا المسار الجديد هنا 👇
  branch: 'main' | 'hardware' | 'ai' | 'iot'; 
  resources: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'course';
  }[];
  project: string;
  hint?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}