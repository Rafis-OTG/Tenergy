
import React from 'react';
import { AppScreen } from '../types';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  showNav?: boolean;
  title?: string;
  hideHeader?: boolean;
  onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeScreen, 
  onNavigate, 
  showNav = true,
  title,
  hideHeader = false,
  onBack
}) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden relative">
      {/* Top Header */}
      {!hideHeader && (
        <header className="px-6 pt-12 pb-4 flex items-center justify-between bg-white z-20">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-2 -ml-2 text-[#1B407F] hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            )}
            <h1 className="text-2xl font-bold text-[#1B407F]">{title || 'Tenergy'}</h1>
          </div>
          <div 
            onClick={() => onNavigate(AppScreen.PROFILE)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-[#3362B5] transition-all"
          >
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Profile</span>
          </div>
        </header>
      )}

      {/* Content Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar pb-32 ${hideHeader ? 'pt-0' : 'pt-2'}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50 safe-bottom">
          <NavItem 
            isActive={activeScreen === AppScreen.DASHBOARD} 
            onClick={() => onNavigate(AppScreen.DASHBOARD)} 
            label="Главная"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            }
          />
          <NavItem 
            isActive={activeScreen === AppScreen.BOOKING_DATE || activeScreen === AppScreen.BOOKING_TIME || activeScreen === AppScreen.BOOKING_RACKETS || activeScreen === AppScreen.BOOKING_SUMMARY || activeScreen === AppScreen.PAYMENT} 
            onClick={() => onNavigate(AppScreen.BOOKING_DATE)} 
            label="Бронь"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            }
          />
          <NavItem 
            isActive={activeScreen === AppScreen.PARTNERS} 
            onClick={() => onNavigate(AppScreen.PARTNERS)} 
            label="Партнеры"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            }
          />
          <NavItem 
            isActive={activeScreen === AppScreen.PROFILE || activeScreen === AppScreen.MY_CARDS || activeScreen === AppScreen.SETTINGS || activeScreen === AppScreen.SUPPORT} 
            onClick={() => onNavigate(AppScreen.PROFILE)} 
            label="Профиль"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            }
          />
        </nav>
      )}
    </div>
  );
};

const NavItem: React.FC<{ isActive: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ 
  isActive, onClick, label, icon 
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#3362B5]' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);
