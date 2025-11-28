import { useState } from 'react';
import { Search, MapPin, Grid, List } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { LoginModal, RegisterModal } from '../components/auth';
import { Button, Card } from '../components/common';
import { SERVICE_CATEGORIES } from '../utils/constants';
import type { ViewMode } from '../types';

export function Home() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <MainLayout onAuthClick={() => setAuthModal('login')}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Fedezd fel a legjobb szépségszalonokat
          </h2>
          <p className="text-gray-600 text-lg">
            Találd meg a számodra tökéletes szolgáltatót a közeledben
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Keresés név, cím vagy szolgáltatás alapján..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <MapPin className="w-5 h-5" />
              <span className="hidden sm:inline">Helymeghatározás</span>
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategories.includes(cat.value)
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-rose-300'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedCategories.length > 0
                ? `${selectedCategories.length} kategória kiválasztva`
                : 'Összes kategória'}
            </p>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('feed')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'feed'
                    ? 'bg-white shadow-sm text-rose-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-rose-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo Cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} hover className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Demo kép {i}</p>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Demo Szalon {i}
                </h3>
                <p className="text-sm text-gray-600 mb-2">Budapest, Belváros</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>2.5 km</span>
                  <span>•</span>
                  <span>⭐ 4.8 (156)</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Nincs találat a keresésre. Próbálj más kifejezést!
            </p>
          </div>
        )}
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={authModal === 'login'}
        onClose={() => setAuthModal(null)}
        onSwitchToRegister={() => setAuthModal('register')}
      />
      <RegisterModal
        isOpen={authModal === 'register'}
        onClose={() => setAuthModal(null)}
        onSwitchToLogin={() => setAuthModal('login')}
      />
    </MainLayout>
  );
}
