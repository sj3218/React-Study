import { createContext, useState, type ReactNode } from "react";

interface UIContextType {
  title: string;
  setTitle: (title: string) => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("InitTitle");

  return (
    <UIContext.Provider value={{ title, setTitle }}>
      {children}
    </UIContext.Provider>
  );
};
