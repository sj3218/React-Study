import { X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_LIST } from "../../constants/menu";
import { Link } from "react-router-dom";
interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}
export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	return (
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-[#0F172A] h-screen flex flex-col relative z-50 overflow-hidden shadow-2xl shadow-black/50">
					<div className="w-64 flex flex-col h-full">
						<div className="p-8 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center">
									<Activity className="w-5 h-5 text-white" />
								</div>
								<span className="font-extrabold text-xl tracking-tighter text-white">사이드 바</span>
							</div>
							<button onClick={onClose} className="p-1 text-[#94A3B8] hover:text-white rounded">
								<X className="w-5 h-5" />
							</button>
						</div>

						<nav className="flex-1 space-y-0.5">
							{MENU_LIST.map((menu, index) => (
								<Link to={menu.url}>
									<div className="sidebar-item sidebar-item-active" key={index}>
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
