import { MainLayout } from '../components/layout';
import { Card } from '../components/common';
import { LayoutDashboard, TrendingUp, Users, Calendar } from 'lucide-react';

export function Dashboard() {
  return (
    <MainLayout showHeader={false}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Szolgáltatói Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Megtekintések</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Követők</p>
                <p className="text-2xl font-bold text-gray-900">567</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-2xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Foglalások</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <LayoutDashboard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Értékelések</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Szalonok kezelése</h2>
          <p className="text-gray-600">
            Itt kezelheted a szalonod adatait, szolgáltatásokat, nyitvatartást és posztokat.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
