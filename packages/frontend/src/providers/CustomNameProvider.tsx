import { createContext, useContext, useState, ReactNode } from 'react';

interface CustomNameContextType {
  customName: boolean[];
  setCustomName: (value: boolean[]) => void;
}

const CustomNameContext = createContext<CustomNameContextType | undefined>(undefined);

export function CustomNameProvider({ children }: { children: ReactNode }) {
  const [customName, setCustomName] = useState<boolean[]>([false]);

  return (
    <CustomNameContext.Provider value={{ customName, setCustomName }}>
      {children}
    </CustomNameContext.Provider>
  );
}

export function useCustomName() {
  const context = useContext(CustomNameContext);
  if (context === undefined) {
    throw new Error('useCustomName must be used within a CustomNameProvider');
  }
  return context;
} 