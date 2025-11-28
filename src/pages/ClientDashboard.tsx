import { MainLayout } from '../components/layout';
import { Card } from '../components/common';
import { Calendar, Heart, Settings } from 'lucide-react';

export function ClientDashboard() {
  return (
    <MainLayout showHeader={false}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profilom</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-rose-100 rounded-2xl mb-4">
                <Calendar className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Foglalásaim</h3>
              <p className="text-sm text-gray-600">Közelgő és korábbi időpontok</p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-pink-100 rounded-2xl mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kedvencek</h3>
              <p className="text-sm text-gray-600">Mentett szalonok és szolgáltatók</p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-100 rounded-2xl mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Beállítások</h3>
              <p className="text-sm text-gray-600">Profil adatok módosítása</p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
