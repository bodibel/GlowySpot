import { useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card } from '../components/common';

export function SalonProfile() {
  const { id } = useParams<{ id: string }>();

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Card className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Szalon Profil</h1>
          <p className="text-gray-600">Szalon ID: {id}</p>
          <p className="text-sm text-gray-500 mt-4">
            Ez egy placeholder oldal. A teljes funkcionalitás hamarosan elérhető lesz.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
