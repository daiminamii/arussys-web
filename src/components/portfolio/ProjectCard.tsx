// プロジェクトカード（タイトル / 説明 / タグ / リンク）
import type { Project } from '@/types/portfolio';
import { useLanguage } from '@/i18n/LanguageContext';

function ProjectCard({ project }: { project: Project }) {
  const { language, t } = useLanguage();

  return (
    <article className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-600">
      {/* タイトル + 年 */}
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-100">
          {project.title[language]}
        </h3>
        <span className="shrink-0 text-sm text-gray-500">{project.year}</span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-400">
        {project.description[language]}
      </p>

      {/* 技術タグ */}
      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 外部リンク */}
      {(project.url || project.github) && (
        <div className="flex gap-4 text-sm">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 underline underline-offset-2 hover:text-gray-200"
            >
              {t.project.website}
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 underline underline-offset-2 hover:text-gray-200"
            >
              {t.project.github}
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
