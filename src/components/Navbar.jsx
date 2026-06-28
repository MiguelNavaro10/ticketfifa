import { useState } from 'react';
import { useAuth } from '../data/AuthContext';
import { usePurchases } from '../data/PurchasesContext';
import LoginModal from './LoginModal';

export default function Navbar({ onHome, onNavLink, onMisEntradas }) {
  const { user, logout } = useAuth();
  const { purchases } = usePurchases();
  const [loginOpen, setLoginOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const newApproved = user
    ? purchases.filter(p => p.status === 'approved' && p.user?.id === user.id).length
    : 0;
  const pendingCount = purchases.filter(p => p.status === 'pending').length;
  const notifCount = newApproved > 0 ? newApproved : pendingCount;

  const notifItems = [];
  if (newApproved > 0) {
    notifItems.push({ type: 'approved', count: newApproved, text: `${newApproved} ${newApproved === 1 ? 'entrada ha sido' : 'entradas han sido'} aprobada${newApproved === 1 ? '' : 's'}` });
  }
  if (pendingCount > 0) {
    notifItems.push({ type: 'pending', count: pendingCount, text: `${pendingCount} solicitud${pendingCount === 1 ? '' : 'es'} de compra pendiente${pendingCount === 1 ? '' : 's'}` });
  }

  return (
    <>
      {/* Black banner */}
      <div className="bg-[#1a1a1a] text-white text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-center gap-2">
        <span className="truncate">Somos el mercado en línea de compra y reventa de entradas más grande del mundo...</span>
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={onHome} className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight hover:text-gray-600 transition-colors">ticket</button>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

            {/* Center nav - desktop */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <button onClick={onNavLink} className="hover:text-gray-900 font-medium">Fase de Grupos</button>
              <button onClick={onNavLink} className="hover:text-gray-900 font-medium">Eliminatorias</button>
              <button onClick={onNavLink} className="hover:text-gray-900 font-medium">Sedes/Estadios</button>
              <button onClick={onNavLink} className="hover:text-gray-900 font-medium">Ciudades Anfitrionas</button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden">
                <div className="flex flex-col px-4 py-3 space-y-2 text-sm text-gray-600">
                  <button onClick={() => { setMenuOpen(false); onNavLink(); }} className="py-2 hover:text-gray-900 font-medium text-left">Fase de Grupos</button>
                  <button onClick={() => { setMenuOpen(false); onNavLink(); }} className="py-2 hover:text-gray-900 font-medium text-left">Eliminatorias</button>
                  <button onClick={() => { setMenuOpen(false); onNavLink(); }} className="py-2 hover:text-gray-900 font-medium text-left">Sedes/Estadios</button>
                  <button onClick={() => { setMenuOpen(false); onNavLink(); }} className="py-2 hover:text-gray-900 font-medium text-left">Ciudades Anfitrionas</button>
                  <button onClick={() => { setMenuOpen(false); onMisEntradas(); }} className="py-2 hover:text-gray-900 font-medium text-left md:hidden">Mis entradas</button>
                </div>
              </div>
            )}

            {/* Right nav */}
            <div className="flex items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <button onClick={onMisEntradas} className="hover:text-gray-900 hidden md:block font-medium">Mis entradas</button>
              {user ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-800 hidden sm:block max-w-[100px] truncate">{user.name}</span>
                  <button onClick={logout} className="text-[10px] sm:text-xs text-gray-400 hover:text-gray-600">Salir</button>
                </div>
              ) : (
                <button onClick={() => setLoginOpen(true)}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gray-900 text-white text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors">
                  Iniciar sesión
                </button>
              )}
              <div className="relative">
                <button onClick={() => setNotifOpen(v => !v)} className="relative">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{notifCount}</span>
                    </div>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-8 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Notificaciones</span>
                    </div>
                    {notifItems.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">No hay notificaciones</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {notifItems.map((item, i) => (
                          <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => { setNotifOpen(false); if (item.type === 'approved') onMisEntradas(); }}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.type === 'approved' ? 'bg-green-100' : 'bg-amber-100'}`}>
                              {item.type === 'approved' ? (
                                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-700">{item.text}</p>
                              {item.type === 'approved' && <p className="text-[10px] text-blue-600 font-medium mt-0.5">Ver mis entradas</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
