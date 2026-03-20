import { useState, useEffect } from 'react';
import { Users, Shield, Search, Edit2, Trash2, Ban, CheckCircle, ChevronDown } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Card } from '../components/common';
import { getAllDocuments, updateDocument, deleteDocument } from '../lib/firestore';
import type { User, UserRole, UserStatus } from '../types';

type SortField = 'name' | 'email' | 'role' | 'status' | 'createdAt';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDocuments<User>('users');
      setUsers(data);
    } catch {
      setError('Nem sikerült betölteni a felhasználókat.');
    } finally {
      setLoading(false);
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  const filtered = users
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA: string = '';
      let valB: string = '';
      if (sortField === 'createdAt') {
        const dA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return sortAsc ? dA - dB : dB - dA;
      }
      valA = String(a[sortField] ?? '').toLowerCase();
      valB = String(b[sortField] ?? '').toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  async function saveEdit() {
    if (!editingUser) return;
    setSaving(true);
    setError(null);
    try {
      await updateDocument<User>('users', editingUser.id, {
        name: editingUser.name,
        role: editingUser.role,
        status: editingUser.status,
      });
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    } catch {
      setError('Nem sikerült menteni a módosításokat.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleBan(user: User) {
    const newStatus: UserStatus = user.status === 'banned' ? 'active' : 'banned';
    try {
      await updateDocument<User>('users', user.id, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    } catch {
      setError('Nem sikerült frissíteni a státuszt.');
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) return;
    try {
      await deleteDocument('users', userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      setError('Nem sikerült törölni a felhasználót.');
    }
  }

  const roleBadge: Record<UserRole, string> = {
    admin: 'bg-purple-100 text-purple-700',
    provider: 'bg-blue-100 text-blue-700',
    client: 'bg-gray-100 text-gray-700',
  };

  const roleLabel: Record<UserRole, string> = {
    admin: 'Admin',
    provider: 'Szolgáltató',
    client: 'Ügyfél',
  };

  const statusBadge: Record<UserStatus, string> = {
    active: 'bg-green-100 text-green-700',
    banned: 'bg-red-100 text-red-700',
    deleted: 'bg-gray-100 text-gray-500',
  };

  const statusLabel: Record<UserStatus, string> = {
    active: 'Aktív',
    banned: 'Tiltott',
    deleted: 'Törölve',
  };

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30 inline ml-1" />;
    return (
      <ChevronDown
        className={`w-3 h-3 inline ml-1 transition-transform ${sortAsc ? '' : 'rotate-180'}`}
      />
    );
  }

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-2xl">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Felhasználók kezelése</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Összes felhasználó', value: users.length, color: 'text-gray-900' },
            { label: 'Aktív', value: users.filter((u) => u.status === 'active').length, color: 'text-green-600' },
            { label: 'Tiltott', value: users.filter((u) => u.status === 'banned').length, color: 'text-red-600' },
            { label: 'Szolgáltató', value: users.filter((u) => u.role === 'provider').length, color: 'text-blue-600' },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search */}
        <Card className="p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Keresés név, email vagy szerepkör alapján..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
          </div>
        </Card>

        {/* User Table */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-gray-100">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">
              Felhasználók ({filtered.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Betöltés...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nincs találat.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th
                      className="text-left px-4 py-3 font-medium cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('name')}
                    >
                      Név <SortIcon field="name" />
                    </th>
                    <th
                      className="text-left px-4 py-3 font-medium cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('email')}
                    >
                      Email <SortIcon field="email" />
                    </th>
                    <th
                      className="text-left px-4 py-3 font-medium cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('role')}
                    >
                      Szerepkör <SortIcon field="role" />
                    </th>
                    <th
                      className="text-left px-4 py-3 font-medium cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('status')}
                    >
                      Státusz <SortIcon field="status" />
                    </th>
                    <th className="text-right px-4 py-3 font-medium">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-semibold text-xs flex-shrink-0">
                            {u.name?.charAt(0)?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge[u.role]}`}>
                          {roleLabel[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[u.status]}`}>
                          {statusLabel[u.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser({ ...u })}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            title="Szerkesztés"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleBan(u)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.status === 'banned'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-orange-500 hover:bg-orange-50'
                            }`}
                            title={u.status === 'banned' ? 'Tiltás feloldása' : 'Tiltás'}
                          >
                            {u.status === 'banned' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Törlés"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Felhasználó szerkesztése</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Név</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Az email cím nem módosítható.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Szerepkör</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  >
                    <option value="client">Ügyfél</option>
                    <option value="provider">Szolgáltató</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Státusz</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, status: e.target.value as UserStatus })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  >
                    <option value="active">Aktív</option>
                    <option value="banned">Tiltott</option>
                    <option value="deleted">Törölve</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Mégse
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Mentés...' : 'Mentés'}
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
