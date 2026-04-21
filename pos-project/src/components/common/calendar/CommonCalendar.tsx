import { Search } from "lucide-react";
import { Calendar } from "./Calendar";

interface CalendarProps {}

export const CommonCalendar = () => {
	// const handleUpdateData = ()=>{

	// };

	return (
		<div className="flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-full shadeow-sm">
			<Calendar />
			<div className="px-3">~</div>
			<Calendar />
			<button className="ml-3 px-2 py-1 border rounded-lg bg-blue-500 text-white flex items-center hover:bg-blue-600">
				<Search size={18} className="mr-2" />
				조회
			</button>
		</div>
	);
};
