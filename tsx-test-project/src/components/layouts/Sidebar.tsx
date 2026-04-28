import { X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_LIST } from "../../constants/menu";
import { Link } from "react-router-dom";
import { useUI } from "../../context/UIContext";
import { useState } from "react";

export const Sidebar = () => {
	const { isSidebarOpen, setIsSidebarOpen } = useUI();
	const [activeCategory, setActiveCategory] = useState("1");
	return (
		<AnimatePresence mode="wait">
			{isSidebarOpen && (
				<motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-[#0F172A] h-screen flex flex-col relative z-50 overflow-hidden shadow-2xl shadow-black/50">
					<div className="flex flex-col h-full">
						<div className="p-8 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center">
									<Activity className="w-5 h-5 text-white" />
								</div>
								<span className="font-extrabold text-xl tracking-tighter text-white">사이드 바</span>
							</div>
							<button onClick={() => setIsSidebarOpen(false)} className="p-1 text-[#94A3B8] hover:text-white rounded">
								<X className="w-5 h-5" />
							</button>
						</div>

						<nav className="flex-1 space-y-0.5">
							{MENU_LIST.map((menu, index) => (
								<Link to={menu.url} key={index}>
								
									<div className={`w-full flex items-center p-3 rounded-xl transition-all ${
                 activeCategory === menu.id 
                  ? 'bg-[#00C3FF]/10 border border-[#00C3FF]/30 text-[#00C3FF]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
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
