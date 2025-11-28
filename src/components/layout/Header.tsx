import { User, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onAuthClick?: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
          BeautyGram
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Belépés</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
