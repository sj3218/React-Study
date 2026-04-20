import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatcardProps {
	title: string;
	number: number;
	icon?: LucideIcon;
	option_text?: string;
	option_color?: string;
}

export const Statcard = ({ title, number, option_text, icon: Icon, option_color = "#64748B" }: StatcardProps) => {
	return (
		<div className="enterprise-card p-6">
			<p className="text-[#64748B] text-[10px] font-extrabold uppercase tracking-widest mb-2">{title}</p>
			<h3 className="text-2xl font-bold font-mono tracking-tight">{number}</h3>
			{option_text && (
				<div className="flex items-center gap-1 mt-3 text-xs font-bold" style={{ color: option_color }}>
					{Icon && <Icon className="w-3 h-3" />}
					{option_text}
				</div>
			)}
		</div>
		// <motion.div whileHover={{ y: -2 }} className="enterprise-card p-6">
		// 	<p className="text-[#64748B] text-[10px] font-extrabold uppercase tracking-widest mb-2">{title}</p>
		// 	<h3 className="text-2xl font-bold font-mono tracking-tight">{number}</h3>
		// 	{option_text && (
		// 		<div className="flex items-center gap-1 mt-3 text-xs font-bold" style={{ color: option_color }}>
		// 			{Icon && <Icon className="w-3 h-3" />}
		// 			{option_text}
		// 		</div>
		// 	)}
		// </motion.div>
	);
};
