// ポートフォリオ プロジェクト型
import type { Language } from '@/i18n/types';

export interface Project {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  tags: string[];
  url?: string;
  github?: string;
  year: number;
}
