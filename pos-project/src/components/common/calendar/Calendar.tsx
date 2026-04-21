import { useState } from "react";
import { getCalendarDays } from "../../../utils/dateUtils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export const Calendar = () => {
	const [viewDate, setViewDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isOpen, setIsOpen] = useState(false);

	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const days = getCalendarDays(year, month);

	const handleDateClick = (day: number) => {
		const newDate = new Date(year, month, day);
		setSelectedDate(newDate);
		setIsOpen(false);
	};

	return (
		<div className="relative font-sans">
			<div className="flex items-center">
				<input type="text" readOnly value={selectedDate.toLocaleDateString("sv-SE")} className="w-21 outline-none text-sm font-medium cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
				<div className="w-[1px] h-4 bg-slate-200" /> {/* 구분선 */}
				<CalendarIcon size={18} className=" ml-3 text-slate-400 cursor-pointer hover:text-blue-600" onClick={() => setIsOpen(!isOpen)} />
			</div>
			{/* calendar popup */}
			{isOpen && (
				<div className="absolute top-14 left-0 z-50 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
					{/* calendar header - can move year and month */}
					<div className="flex justify-between items-center mb-4 px-1">
						<span className="font-bold text-slate-800">
							{year}년 {month + 1}월
						</span>
						<div className="flex gap-2">
							<button onClick={() => setViewDate(new Date(year, month - 1))}>
								<ChevronLeft size={18} />
							</button>
							<button onClick={() => setViewDate(new Date(year, month + 1))}>
								<ChevronRight size={18} />
							</button>
						</div>
					</div>

					{/* days */}
					<div className="grid grid-cols-7 mb-2">
						{["일", "월", "화", "수", "목", "금", "토"].map((d) => (
							<div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">
								{d}
							</div>
						))}
					</div>

					{/* dates */}
					<div className="grid grid-cols-7">
						{days.map((day, i) => (
							<div key={i} className="aspect-square flex items-center justify-center text-sm">
								{day && (
									<button
										onClick={() => handleDateClick(day)}
										className={`w-8 h-8 rounded-lg transition-colors ${
											selectedDate.getDate() === day && selectedDate.getMonth() === month
												? "bg-blue-600 text-white font-bold" // 선택된 날
												: "hover:bg-slate-100 text-slate-700"
										}`}
									>
										{day}
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
