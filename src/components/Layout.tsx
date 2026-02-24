// 共通レイアウト（ヘッダー / メイン / フッター）
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import MobileNav from './MobileNav';

// デスクトップナビとMobileNavの両方で使用
export const navItems: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/strava', label: 'Strava' },
];

export const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200';

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* ナビゲーション */}
      <header className="border-b border-gray-800">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-xl font-bold tracking-tight">
            Arus Systems
          </NavLink>

          {/* デスクトップナビ */}
          <ul className="hidden md:flex gap-6 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ハンバーガーボタン（モバイル） */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
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
        &copy; {new Date().getFullYear()} Arus Systems
      </footer>
    </div>
  );
}

export default Layout;
