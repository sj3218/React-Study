import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
	return (
		<div className="flex flex-row h-screen w-screen bg-slate-50 overflow-x-hidden">
			<Sidebar />
			<main className="flex-1 h-screen overflow-y-auto relative flex flex-col transition-colors duration-500 bg-slate-50 text-slate-900 dark:bg-slate-600">
				{/* <Header /> */}
				<Outlet />
				{/* <Footer /> */}
			</main>
		</div>
	);
};
