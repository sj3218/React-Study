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
