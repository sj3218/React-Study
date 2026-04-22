import type { LucideIcon } from "lucide-react";

interface StatcardProps {
	title: string;
	number: number;
	unit?:string;
	icon?: LucideIcon;
	option_text?: string;
	option_color?: string;
}

export const Statcard = ({ title, number, option_text, unit, icon: Icon, option_color = "text-slate-500" }: StatcardProps) => {
	return (
		<div className="enterprise-card p-6">
			<p className="text-[#64748B] text-[10px] font-extrabold uppercase tracking-widest mb-2">{title}</p>
			<h3 className="text-2xl font-bold font-sans tracking-tight">{number.toLocaleString()}
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
