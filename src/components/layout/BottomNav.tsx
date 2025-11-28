import { NavLink } from 'react-router-dom';
import { Home, User, Calendar, Heart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function BottomNav() {
  const { user } = useAuth();

  const navigation = [
    { name: 'Főoldal', href: '/', icon: Home },
    ...(user
      ? [
          user.role === 'provider'
            ? { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
            : { name: 'Profil', href: '/client-dashboard', icon: User },
          { name: 'Foglalások', href: '/bookings', icon: Calendar },
          { name: 'Kedvencek', href: '/favorites', icon: Heart },
        ]
      : []),
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive ? 'text-rose-600' : 'text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'text-rose-600' : 'text-gray-600'}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
