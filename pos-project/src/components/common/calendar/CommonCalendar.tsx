import { Search } from "lucide-react";
import { Calendar } from "./Calendar";

interface CalendarProps {}

export const CommonCalendar = () => {
	// const handleUpdateData = ()=>{

	// };

	//1. 다른 곳 클릭하면 팝업 사라지도록 수정
	//2. 날짜 왼쪽 값이 더 미래면, 알람 뜨도록 수정

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
