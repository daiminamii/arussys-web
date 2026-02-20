// 共通レイアウト（ヘッダー / メイン / フッター）
import { NavLink, Outlet } from 'react-router-dom';

// NavLink共通スタイル（アクティブ: 白、非アクティブ: グレー）
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* ナビゲーション */}
      <header className="border-b border-gray-800">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-xl font-bold tracking-tight">
            Arus Systems
          </NavLink>
          <ul className="flex gap-6 text-sm">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" className={navLinkClass}>
                Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink to="/strava" className={navLinkClass}>
                Strava
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

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
