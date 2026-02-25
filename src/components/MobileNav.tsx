// モバイルナビ（フルスクリーン オーバーレイ + フォーカストラップ）
import { useCallback, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { navKeys, navLinkClass } from './Layout';
import LanguageSwitch from './LanguageSwitch';

interface MobileNavProps {
  onClose: () => void;
}

function MobileNav({ onClose }: MobileNavProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const initialPathname = useRef(location.pathname);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // マウント時のパスと異なるパスに遷移したら閉じる（マウント直後の発火を回避）
  useEffect(() => {
    if (location.pathname !== initialPathname.current) {
      onClose();
    }
  }, [location.pathname, onClose]);

  // マウント時に閉じるボタンへフォーカス移動
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // フォーカストラップ + Escape閉じ
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // メニュー表示中の背景スクロールを防止
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 md:hidden bg-gray-950/95 backdrop-blur-sm animate-[fade-in_0.2s_ease]"
      role="dialog"
      aria-modal="true"
      aria-label={t.aria.siteMenu}
      onClick={onClose}
    >
      {/* 閉じるボタン */}
      <button
        ref={closeButtonRef}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        onClick={onClose}
        aria-label={t.aria.closeMenu}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <nav
        className="flex flex-col items-center justify-center h-full gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {navKeys.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${navLinkClass({ isActive })} block py-4 text-xl`
            }
            onClick={onClose}
          >
            {t.nav[item.key]}
          </NavLink>
        ))}

        {/* 区切り線 + 言語切替 */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <LanguageSwitch />
        </div>
      </nav>
    </div>
  );
}

export default MobileNav;
