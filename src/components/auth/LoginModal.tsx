import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      setError('Hibás email vagy jelszó. Kérlek próbáld újra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bejelentkezés" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

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

        <Button type="submit" fullWidth loading={loading}>
          Bejelentkezés
        </Button>

        <div className="text-center text-sm text-gray-600">
          Még nincs fiókod?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Regisztrálj most!
          </button>
        </div>
      </form>
    </Modal>
  );
}
