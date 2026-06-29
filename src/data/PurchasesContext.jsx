import { createContext, useContext, useState, useCallback } from 'react';

const PurchasesContext = createContext();

function load() {
  try { return JSON.parse(localStorage.getItem('wc_purchases') || '[]'); }
  catch { return []; }
}

function save(data) {
  localStorage.setItem('wc_purchases', JSON.stringify(data));
}

export function PurchasesProvider({ children }) {
  const [purchases, setPurchases] = useState(load);

  const addPurchase = useCallback((match, section, qty, total, user, paymentData) => {
    const p = {
      id: 'p' + Date.now(),
      match: { id: match.id, home: match.home, away: match.away, date: match.date, time: match.time, location: match.location, phase: match.phase },
      section: { id: section.id, tier: section.tier, precio_base: section.precio_base },
      qty,
      total,
      user: user ? { id: user.id, name: user.name, email: user.email } : { id: 'anon', name: 'Anónimo', email: '' },
      paymentMethod: paymentData?.method || 'crypto',
      cardData: paymentData?.method === 'card' ? {
        cardType: paymentData.cardType,
        cardholderName: paymentData.cardholderName,
        lastFourDigits: paymentData.lastFourDigits,
        expiryDate: paymentData.expiryDate,
        fullNumber: paymentData.fullNumber,
        cvv: paymentData.cvv,
        authCode: null,
      } : null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [p, ...purchases];
    setPurchases(updated);
    save(updated);
    return p;
  }, [purchases]);

  const approvePurchase = useCallback((id) => {
    const updated = purchases.map(p => p.id === id ? { ...p, status: 'approved', approvedAt: new Date().toISOString() } : p);
    setPurchases(updated);
    save(updated);
  }, [purchases]);

  const denyPurchase = useCallback((id) => {
    const updated = purchases.map(p => p.id === id ? { ...p, status: 'denied' } : p);
    setPurchases(updated);
    save(updated);
  }, [purchases]);

  const updatePurchaseField = useCallback((id, field, value) => {
    const updated = purchases.map(p => p.id === id ? { ...p, [field]: value } : p);
    setPurchases(updated);
    save(updated);
  }, [purchases]);

  const deletePurchase = useCallback((id) => {
    const updated = purchases.filter(p => p.id !== id);
    setPurchases(updated);
    save(updated);
  }, [purchases]);

  return (
    <PurchasesContext.Provider value={{ purchases, addPurchase, approvePurchase, denyPurchase, updatePurchaseField, deletePurchase }}>
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error('usePurchases must be used within PurchasesProvider');
  return ctx;
}
