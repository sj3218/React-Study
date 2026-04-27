import { Menu, Moon, Sun } from "lucide-react";
import { useUI } from "../../hooks/useUI";

export const Header = () => {
	const { title, isSidebarOpen, setIsSidebarOpen, isDark, toggleDark } = useUI();
	return (
		<header className="sticky top-0 bg-white border-b border-[#E2E8F0] px-10 py-5 flex items-center justify-between z-40">
			<div className="flex items-center gap-6">
				{!isSidebarOpen && (
					<button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-[#F1F5F9] rounded-lg text-[#64748B]">
						<Menu className="w-6 h-6" />
					</button>
				)}
				<h1 className="text-lg font-bold text-[#1E293B]">{title}</h1>
			</div>

			<div className="flex items-center gap-6">
				<div className="w-px h-6 bg-[#E2E8F0] hidden sm:block"></div>

				<div className="flex items-center gap-4">
					<button onClick={toggleDark} className="p-2 text-[#64748B] hover:text-[#1E293B] transition-colors relative">
						{isDark ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</div>
			</div>
		</header>
	);
};
