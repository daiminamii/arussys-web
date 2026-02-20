// ポートフォリオ プロジェクト型
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  github?: string;
  year: number;
}
