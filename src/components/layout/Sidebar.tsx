import { NavLink } from 'react-router-dom';
import { Home, User, Calendar, Heart, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Főoldal', href: '/', icon: Home },
    ...(user
      ? [
          user.role === 'provider'
            ? { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
            : { name: 'Profil', href: '/client-dashboard', icon: User },
          { name: 'Foglalásaim', href: '/bookings', icon: Calendar },
          { name: 'Kedvencek', href: '/favorites', icon: Heart },
          { name: 'Beállítások', href: '/settings', icon: Settings },
        ]
      : []),
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 bg-white border-r border-gray-200 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
          BeautyGram
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <User className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Kijelentkezés</span>
          </button>
        </div>
      )}
    </aside>
  );
}
