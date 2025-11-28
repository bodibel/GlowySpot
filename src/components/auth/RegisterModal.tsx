import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    if (password.length < 6) {
      setError('A jelszónak minimum 6 karakter hosszúnak kell lennie!');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name, role);
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('client');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Ez az email cím már használatban van!');
      } else {
        setError('Hiba történt a regisztráció során. Kérlek próbáld újra!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regisztráció" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          type="text"
          label="Teljes név"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kovács János"
          required
        />

        <Input
          type="email"
          label="Email cím"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="pelda@email.com"
          required
        />

        <Input
          type="password"
          label="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Input
          type="password"
          label="Jelszó megerősítése"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fiók típusa
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                role === 'client'
                  ? 'border-rose-600 bg-rose-50 text-rose-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">👤</div>
              <div className="font-medium">Vendég</div>
              <div className="text-xs text-gray-500">Szolgáltatás keresése</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                role === 'provider'
                  ? 'border-rose-600 bg-rose-50 text-rose-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">💼</div>
              <div className="font-medium">Szolgáltató</div>
              <div className="text-xs text-gray-500">Szalon kezelése</div>
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Regisztráció
        </Button>

        <div className="text-center text-sm text-gray-600">
          Már van fiókod?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Jelentkezz be!
          </button>
        </div>
      </form>
    </Modal>
  );
}
