// プロジェクト一覧ページ
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { projects } from '@/data/projects';

function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Portfolio</h1>
      <p className="mb-10 text-gray-400">
        Selected projects in sports tech, 3D visualization, and web development.
      </p>
      <ProjectGrid projects={projects} />
    </div>
  );
}

export default PortfolioPage;
