import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-xl font-bold tracking-tight">
            Arus Systems
          </NavLink>
          <ul className="flex gap-6 text-sm">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/portfolio"
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                }
              >
                Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/strava"
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                }
              >
                Strava
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Arus Systems
      </footer>
    </div>
  );
}

export default Layout;
