import { motion, AnimatePresence } from "motion/react";
import { MENU_LIST } from "../../constants/menu";
import { Link } from "react-router-dom";
import { useUI } from "../../hooks/useUI";
import { House, X } from "lucide-react";

export const Sidebar = () => {
	const { isSidebarOpen, setIsSidebarOpen } = useUI();

	return (
		<AnimatePresence mode="wait">
			{isSidebarOpen && (
				<motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-white h-screen flex flex-col relative z-50 overflow-hidden shadow-2xl shadow-black/50">
					<div className="flex flex-col h-full">
						<div className="p-8 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-[#78B159] rounded-md flex items-center justify-center">
									<House className="w-8 h-8 text-white" />
								</div>
								<span className="font-extrabold text-xl tracking-tighter text-[#78B159]">crossing</span>
							</div>
							<button onClick={() => setIsSidebarOpen(false)} className="p-1 text-[#94A3B8] rounded">
								<X className="w-5 h-5" />
							</button>
						</div>

						<nav className="flex-1 space-y-0.5">
							{MENU_LIST.map((menu, index) => (
								<Link to={menu.url} key={index}>
									<div className="sidebar-item sidebar-item-active">
										<menu.icon className="w-5 h-5" />
										<span className="text-sm font-semibold">{menu.title}</span>
									</div>
								</Link>
							))}
						</nav>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
};
