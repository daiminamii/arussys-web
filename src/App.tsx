// ルート定義（SPA、Layout共通レイアウト）
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import PortfolioPage from '@/pages/PortfolioPage';
import StravaPage from '@/pages/StravaPage';

// Three.js含むため遅延読み込み
const HomePage = lazy(() => import('@/pages/HomePage'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={null}>
                <HomePage />
              </Suspense>
            }
          />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="strava" element={<StravaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
