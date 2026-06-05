import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	data: number;
	unit?: string;
	icon?: LucideIcon;
	option_text?: string;
	option_color?: string;
}

export const StatCard = ({ title, data, unit, icon: Icon, option_text, option_color = "text-slate-500" }: StatCardProps) => {
	return (
		<div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all duration-200 p-6">
			<p className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mb-2">{title}</p>
			<h3 className="text-2xl font-bold font-sans tracking-tight">
				{data.toLocaleString()}
				<span className="text-sm ml-0.5 font-sans">{unit}</span>
			</h3>
			{option_text && (
				<div className={`flex items-center gap-1 mt-3 text-xs font-bold ${option_color}`}>
					{Icon && <Icon className="w-3 h-3" />}
					{option_text}
				</div>
			)}
		</div>
	);
};
