import { createContext, useContext, useState, type ReactNode } from "react";

interface UIContextType{
    title: string;
    setTitle: (title: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open:boolean) => void;
    isDark : boolean;
    toggleDark: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({children} : {children: ReactNode}) =>{
    const [title, setTitle] = useState("InitTitle");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDark, setIsDark] = useState(false);

    const toggleDark = () => {
        setIsDark((prev) => {
            const nextMode = !prev;
            if(nextMode)
            {
                document.documentElement.classList.remove("dark");
            }
            else
            {
                document.documentElement.classList.add("dark");
            }
            return nextMode;
        });
    };

    return (
        <UIContext.Provider value={{ title, setTitle, isSidebarOpen, setIsSidebarOpen, isDark, toggleDark }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error("useUI must be used within a UIProvider");
    return context;
};