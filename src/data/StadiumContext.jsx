import { createContext, useContext, useState, useCallback } from 'react';
import { generateInitialSections, apply8020 } from './stadiumData';

const StadiumContext = createContext();

export function StadiumProvider({ children }) {
  const [sections, setSections] = useState(() => {
    const base = generateInitialSections();
    return apply8020(base);
  });

  const updateSection = useCallback((id, updates) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const regenerate8020 = useCallback(() => {
    setSections(prev => apply8020(prev));
  }, []);

  return (
    <StadiumContext.Provider value={{ sections, updateSection, regenerate8020 }}>
      {children}
    </StadiumContext.Provider>
  );
}

export function useStadium() {
  const ctx = useContext(StadiumContext);
  if (!ctx) throw new Error('useStadium must be used within StadiumProvider');
  return ctx;
}
