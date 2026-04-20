import { Menu, Moon, Sun } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
interface HeaderProps {
	title: string;
	isSidebarOpen: boolean;
	onOpenSidebar: () => void;
	isDark: boolean;
	setIsDark: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ title, isSidebarOpen, onOpenSidebar, isDark, setIsDark }: HeaderProps) => {
	return (
		<header className="sticky top-0 bg-white border-b border-[#E2E8F0] px-10 py-5 flex items-center justify-between z-40">
			<div className="flex items-center gap-6">
				{!isSidebarOpen && (
					<button onClick={onOpenSidebar} className="p-2 hover:bg-[#F1F5F9] rounded-lg text-[#64748B]">
						<Menu className="w-6 h-6" />
					</button>
				)}
				<h1 className="text-lg font-bold text-[#1E293B]">{title}</h1>
			</div>

			<div className="flex items-center gap-6">
				<div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[#10B981] rounded-full border border-emerald-100">
					<div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
					<span className="text-xs font-bold uppercase tracking-wider">DB Connected</span>
				</div>

				<div className="w-px h-6 bg-[#E2E8F0] hidden sm:block"></div>

				<div className="flex items-center gap-4">
					<button className="p-2 text-[#64748B] hover:text-[#1E293B] transition-colors relative" onClick={() => setIsDark(!isDark)}>
						{isDark ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</div>
			</div>
		</header>
	);
};
