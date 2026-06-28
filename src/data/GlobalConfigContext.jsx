import { createContext, useContext, useState, useCallback } from 'react';

const GlobalConfigContext = createContext();

export function GlobalConfigProvider({ children }) {
  const [cryptoWallet, setCryptoWallet] = useState(() => {
    const saved = localStorage.getItem('wc_cryptoWallet');
    if (saved) { localStorage.removeItem('wc_cryptoWallet'); }
    return '0x482c510478d3A132644B41A5f4aaDa07c949f327';
  });
  const [whatsappNum, setWhatsappNum] = useState(() => {
    const saved = localStorage.getItem('wc_whatsappNum');
    if (saved) { localStorage.removeItem('wc_whatsappNum'); }
    return '18578229313';
  });

  const updateCryptoWallet = useCallback((val) => {
    setCryptoWallet(val);
    localStorage.setItem('wc_cryptoWallet', val);
  }, []);

  const updateWhatsappNum = useCallback((val) => {
    setWhatsappNum(val);
    localStorage.setItem('wc_whatsappNum', val);
  }, []);

  return (
    <GlobalConfigContext.Provider value={{ cryptoWallet, updateCryptoWallet, whatsappNum, updateWhatsappNum }}>
      {children}
    </GlobalConfigContext.Provider>
  );
}

export function useGlobalConfig() {
  const ctx = useContext(GlobalConfigContext);
  if (!ctx) throw new Error('useGlobalConfig must be used within GlobalConfigProvider');
  return ctx;
}
