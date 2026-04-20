import { CalendarDays } from "lucide-react";

interface CalendarProps {
	year: string;
	month: string;
	day: string;
}
export const Calendar = () => {
	const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return <div>calendar</div>;
};

// 1. 달력 로직의 핵심 (Date Helper)
// 달력을 그리려면 두 가지 정보가 꼭 필요합니다.

// 이번 달의 시작 요일: 1일이 무슨 요일(일~토)인가? (그 앞은 빈칸으로 채워야 하니까요)

// 이번 달의 마지막 날짜: 28, 30, 31일 중 언제 끝나는가?
// // src/utils/dateUtils.ts
// export const getCalendarDays = (year: number, month: number) => {
//     const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0(일) ~ 6(토)
//     const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // 이번 달 마지막 날짜
    
//     const days = [];
    
//     // 1. 시작 요일 전까지 빈 칸(또는 이전 달 날짜) 채우기
//     for (let i = 0; i < firstDayOfMonth; i++) {
//         days.push(null); 
//     }
    
//     // 2. 1일부터 마지막 날까지 채우기
//     for (let i = 1; i <= lastDateOfMonth; i++) {
//         days.push(i);
//     }
    
//     return days;
// };

// 2. 컴포넌트 구조 (CommonCalendar.tsx)
// 이제 위 로직을 바탕으로 UI를 구성합니다.

// import { useState } from "react";
// import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

// export const CommonCalendar = () => {
//     const [viewDate, setViewDate] = useState(new Date()); // 달력에 보여줄 기준 달
//     const [selectedDate, setSelectedDate] = useState(new Date()); // 실제 선택된 날
//     const [isOpen, setIsOpen] = useState(false);

//     const year = viewDate.getFullYear();
//     const month = viewDate.getMonth();
//     const days = getCalendarDays(year, month);

//     const handleDateClick = (day: number) => {
//         const newDate = new Date(year, month, day);
//         setSelectedDate(newDate);
//         setIsOpen(false); // 선택 후 닫기
//     };

//     return (
//         <div className="relative font-sans">
//             {/* Input 스타일 영역 */}
//             <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm">
//                 <input 
//                     type="text" 
//                     readOnly 
//                     value={selectedDate.toISOString().split('T')[0]} 
//                     className="w-24 outline-none text-sm font-medium cursor-pointer"
//                     onClick={() => setIsOpen(!isOpen)}
//                 />
//                 <div className="w-[1px] h-4 bg-slate-200" /> {/* 구분선 */}
//                 <CalendarIcon 
//                     size={18} 
//                     className="text-slate-400 cursor-pointer hover:text-blue-600" 
//                     onClick={() => setIsOpen(!isOpen)}
//                 />
//             </div>

//             {/* 달력 팝업 */}
//             {isOpen && (
//                 <div className="absolute top-14 left-0 z-50 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
//                     {/* 달력 헤더 (년/월 이동) */}
//                     <div className="flex justify-between items-center mb-4 px-1">
//                         <span className="font-bold text-slate-800">{year}년 {month + 1}월</span>
//                         <div className="flex gap-2">
//                             <button onClick={() => setViewDate(new Date(year, month - 1))}><ChevronLeft size={18}/></button>
//                             <button onClick={() => setViewDate(new Date(year, month + 1))}><ChevronRight size={18}/></button>
//                         </div>
//                     </div>

//                     {/* 요일 표시 */}
//                     <div className="grid grid-cols-7 mb-2">
//                         {['일','월','화','수','목','금','토'].map(d => (
//                             <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
//                         ))}
//                     </div>

//                     {/* 날짜 그리드 */}
//                     <div className="grid grid-cols-7">
//                         {days.map((day, i) => (
//                             <div key={i} className="aspect-square flex items-center justify-center text-sm">
//                                 {day && (
//                                     <button 
//                                         onClick={() => handleDateClick(day)}
//                                         className={`w-8 h-8 rounded-lg transition-colors ${
//                                             selectedDate.getDate() === day && selectedDate.getMonth() === month
//                                             ? "bg-blue-600 text-white font-bold" // 선택된 날
//                                             : "hover:bg-slate-100 text-slate-700"
//                                         }`}
//                                     >
//                                         {day}
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };