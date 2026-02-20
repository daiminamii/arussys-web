// プロジェクト一覧グリッド（2列レスポンシブ）
import type { Project } from '@/types/portfolio';
import ProjectCard from './ProjectCard';

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectGrid;
