import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  onAuthClick?: () => void;
}

export function MainLayout({ children, showHeader = true, onAuthClick }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Header - Mobile */}
      {showHeader && <Header onAuthClick={onAuthClick} />}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0 pt-16 lg:pt-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <BottomNav />
    </div>
  );
}
