// プロジェクト一覧ページ
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { projects } from '@/data/projects';
import { useLanguage } from '@/i18n/LanguageContext';

function PortfolioPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">{t.portfolio.heading}</h1>
      <p className="mb-10 text-gray-400">
        {t.portfolio.subtitle}
      </p>
      <ProjectGrid projects={projects} />
    </div>
  );
}

export default PortfolioPage;
