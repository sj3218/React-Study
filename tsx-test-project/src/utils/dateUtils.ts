export const getCalendarDays = (year: number, month: number) => {
	const firstDayofMonth = new Date(year, month, 1).getDay();
	const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

	const days = [];

	for (let i = 0; i < firstDayofMonth; ++i) {
		days.push(null);
	}

	for (let i = 1; i <= lastDateOfMonth; ++i) {
		days.push(i);
	}

	return days;
};
