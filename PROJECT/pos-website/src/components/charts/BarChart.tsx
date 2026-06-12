import { Bar } from "react-chartjs-2";
import { COLORS } from "../../constants/colors";
import type { DATA_NUMBER } from "../../types/charts";

type BarChartProps = {
	title: string;
	axis?: "x" | "y";
	data: DATA_NUMBER[];
	labels?: never;
};

export const BarChart = ({ title, axis = "x", data, labels }: BarChartProps) => {
	if (!data || data.length === 0) {
		console.log("데이터가 존재하지 않습니다.");
		return null;
	}

	const isMulti = labels !== undefined;
	const chartData = {
		labels: (data as DATA_NUMBER[]).map((item) => item.name),
		datasets: [
			{
				data: (data as DATA_NUMBER[]).map((item) => item.value),
				backgroundColor: COLORS,
				borderRadius: 4,
				borderSkipped: false,
				barPercentage: 0.3,
				categoryPercentage: 0.8,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: axis,
		plugins: {
			legend: { display: isMulti },
			tooltip: { enabled: true },
			datalabels: { display: false },
		},
	};

	return (
		<div className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col">
			<h2 className="text-[18px] font-bold mb-6 text-slate-800">{title}</h2>
			<div className="relative h-55 w-full mb-6 flex justify-center">
				<Bar data={chartData} options={options as any} />
			</div>
		</div>
	);
};
