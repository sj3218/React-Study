import { Bar } from "react-chartjs-2";
import { COLORS } from "../../constants/colors";
import type { DATA_NUMBERS } from "../../types/charts";

interface StackedBarChartProps {
	title: string;
	labels: string[];
	data: DATA_NUMBERS[];
}

export const StackedBarChart = ({ title, labels, data }: StackedBarChartProps) => {
	if (!data || data.length === 0) {
		console.log("데이터가 존재하지 않습니다.");
		return null;
	}

	const chartData = {
		labels,
		datasets: data.map((item, i) => ({
			labels: item.name,
			data: item.values,
			backgroundColor: COLORS[i % COLORS.length],
			borderRadius: 4,
		})),
	};

	const options = {
		plugins: {
			legend: {
				position: "top" as const,
			},
			labels: {
				usePointStyle: true,
				padding: 20,
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	};

	return (
		<div className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col">
			<h2 className="text-[20px] font-bold mb-4">{title}</h2>
			<div className="flex-1 flex justify-center items-center relative">
				<Bar data={chartData} options={options} />
			</div>
		</div>
	);
};
