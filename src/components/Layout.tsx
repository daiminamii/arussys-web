// 共通レイアウト（ヘッダー / メイン / フッター）
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import type { Translations } from '@/i18n/types';
import { useLanguage } from '@/i18n/LanguageContext';
import LanguageSwitch from './LanguageSwitch';
import MobileNav from './MobileNav';

// デスクトップナビとMobileNavの両方で使用
export const navKeys: { to: string; key: keyof Translations['nav']; end?: boolean }[] = [
  { to: '/', key: 'home', end: true },
  { to: '/portfolio', key: 'portfolio' },
  { to: '/strava', key: 'strava' },
];

export const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200';

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* ナビゲーション */}
      <header className="border-b border-gray-800">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-xl font-bold tracking-tight">
            Arus Systems
          </NavLink>

          {/* デスクトップナビ */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex gap-6 text-sm">
              {navKeys.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={navLinkClass}>
                    {t.nav[item.key]}
                  </NavLink>
                </li>
              ))}
            </ul>
            <LanguageSwitch />
          </div>

          {/* ハンバーガーボタン（モバイル） */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.aria.closeMenu : t.aria.openMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* モバイルナビオーバーレイ */}
      {menuOpen && <MobileNav onClose={() => setMenuOpen(false)} />}

      {/* ページ本体 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-800 py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/daiminamii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              {t.contact.heading}
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            {t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
