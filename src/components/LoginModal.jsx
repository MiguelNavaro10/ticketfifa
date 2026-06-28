import { useState } from 'react';
import { useAuth } from '../data/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      const r = login(email, password);
      if (r.error) setError(r.error);
      else onClose();
    } else {
      if (!name.trim()) { setError('El nombre es obligatorio'); return; }
      const r = register(name, email, password);
      if (r.error) setError(r.error);
      else onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit"
            className="w-full py-2.5 bg-[#4c7c0c] hover:bg-[#3d6309] text-white font-bold rounded-lg transition-colors">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
          <p className="text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>¿No tienes cuenta?{' '}
              <button type="button" onClick={() => { setMode('register'); setError(''); }} className="text-blue-600 font-medium hover:underline">Regístrate</button></>
            ) : (
              <>¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-blue-600 font-medium hover:underline">Inicia sesión</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
