// 共通レイアウト（ヘッダー / メイン / フッター）
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        {t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
      </footer>
    </div>
  );
}

export default Layout;
