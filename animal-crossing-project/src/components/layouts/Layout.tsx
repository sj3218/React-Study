import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export const Layout = () => {
	return (
		<div className="flex min-h-screen bg-[#F1F5F9] font-sans text-[#1E293B] overflow-hidden">
			<Sidebar />
			<main className="flex-1 h-screen overflow-y-auto relative flex flex-col transition-colors duration-500 bg-slate-50 text-slate-900 dark:bg-slate-600">
				<Header />
				<Outlet />
				<Footer />
			</main>
		</div>
	);
};
