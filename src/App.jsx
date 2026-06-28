import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import EventListings from './components/EventListings';
import QuantityModal from './components/QuantityModal';
import StadiumView from './components/StadiumView';
import AdminPanel from './components/AdminPanel';
import MatchesAdmin from './components/MatchesAdmin';
import CheckoutSummary from './components/CheckoutSummary';
import FinalizarCompra from './components/FinalizarCompra';
import Navbar from './components/Navbar';
import MisEntradas from './components/MisEntradas';
import WhatsAppWidget from './components/WhatsAppWidget';
import { StadiumProvider } from './data/StadiumContext';
import { MatchesProvider } from './data/MatchesContext';
import { AuthProvider } from './data/AuthContext';
import { GlobalConfigProvider } from './data/GlobalConfigContext';
import { PurchasesProvider } from './data/PurchasesContext';

export default function App() {
  const [view, setView] = useState(() => {
    if (window.location.pathname === '/_a7x' || window.location.hash === '#_a7x') {
      return 'matches-admin';
    }
    return 'home';
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#_a7x') {
        setView('matches-admin');
        window.location.hash = '';
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  function handleAdminLogin(e) {
    e.preventDefault();
    if (adminPassword === '9kM7#pR2') {
      setAdminAuthed(true);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Contraseña incorrecta');
    }
  }

  function goToListings(term) {
    if (term) setSearchTerm(term);
    else setSearchTerm('');
    setView('listings');
  }

  return (
    <AuthProvider>
      <GlobalConfigProvider>
        <StadiumProvider>
          <MatchesProvider>
            <PurchasesProvider>
            {view !== 'admin' && view !== 'matches-admin' && (
              <Navbar
                onHome={() => setView('home')}
                onNavLink={() => goToListings()}
                onMisEntradas={() => setView('mis-entradas')}
              />
            )}

            {view === 'home' && (
              <HomeView
                onSelectWorldCup={() => goToListings()}
                onSearch={goToListings}
              />
            )}

            {view === 'mis-entradas' && (
              <MisEntradas onBack={() => setView('home')} />
            )}

            {view === 'listings' && (
              <>
                <EventListings
                  searchTerm={searchTerm}
                  onViewTickets={(match) => { setSelectedMatch(match); setModalOpen(true); }}
                  onHome={() => setView('home')}
                />
                <QuantityModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onContinue={(qty) => {
                    setSelectedQty(qty);
                    setModalOpen(false);
                    setView('stadium');
                  }}
                />
              </>
            )}

            {view === 'stadium' && (
              <StadiumView
                match={selectedMatch}
                selectedSection={selectedSection}
                onSelectSection={setSelectedSection}
                qty={selectedQty}
                onBack={() => setView('listings')}
                onCheckout={() => setView('checkout')}
              />
            )}

            {view === 'checkout' && (
              <CheckoutSummary
                match={selectedMatch}
                section={selectedSection}
                qty={selectedQty}
                onBack={() => setView('stadium')}
                onProceed={(qty) => {
                  setSelectedQty(qty);
                  setView('finalizar');
                }}
              />
            )}

            {view === 'finalizar' && (
              <FinalizarCompra
                match={selectedMatch}
                section={selectedSection}
                qty={selectedQty}
                onBack={() => setView('checkout')}
                onFinish={() => setView('home')}
              />
            )}

            {view === 'admin' && (
              <AdminPanel onBack={() => setView('stadium')} />
            )}

            {view === 'matches-admin' && !adminAuthed && (
              <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h1 className="text-lg font-extrabold text-white">Acceso restringido</h1>
                    <p className="text-sm text-gray-400 mt-1">Ingresa la contraseña de administrador</p>
                  </div>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <input type="password" placeholder="Contraseña" value={adminPassword}
                      onChange={e => { setAdminPassword(e.target.value); setAdminError(''); }}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4c7c0c]" autoFocus />
                    {adminError && <p className="text-xs text-red-400 font-medium text-center">{adminError}</p>}
                    <button type="submit"
                      className="w-full py-3 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white text-sm font-bold transition-colors">
                      Acceder
                    </button>
                    <button type="button" onClick={() => { setView('home'); setAdminPassword(''); setAdminError(''); }}
                      className="w-full py-2 text-xs text-gray-500 hover:text-gray-300">Volver al inicio</button>
                  </form>
                </div>
              </div>
            )}

            {view === 'matches-admin' && adminAuthed && (
              <MatchesAdmin onBack={() => { setView('home'); setAdminAuthed(false); }} />
            )}

            <WhatsAppWidget />
            </PurchasesProvider>
          </MatchesProvider>
        </StadiumProvider>
      </GlobalConfigProvider>
    </AuthProvider>
  );
}
