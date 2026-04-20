import { useState, type Dispatch, type SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import { MENU_LIST } from "../../constants/menu";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
	title: string;
	isSidebarOpen: boolean;
	setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export const Layout = ({ title, isSidebarOpen, setIsSidebarOpen }: LayoutProps) => {
	const [isDark, setIsDark] = useState(false);

	return (
		<div className="flex min-h-screen bg-[#F1F5F9] font-sans text-[#1E293B] overflow-hidden">
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
			<main className={`flex-1 h-screen overflow-y-auto relative flex flex-col transition-colors duration-500 ${isDark ? "bg-slate-600" : "bg-slate-50 text-slate-900"}`}>
				<Header title={title} isSidebarOpen={isSidebarOpen} onOpenSidebar={() => setIsSidebarOpen(true)} isDark={isDark} setIsDark={setIsDark} />
				<Outlet />
				<Footer />
			</main>
		</div>
	);
};
