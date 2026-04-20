import { COLORS } from "../../constants/types";
import type { DATA_NUMBERS } from "../../constants/types";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StackedBarProps {
	title: string;
	labels: string[];
	data: DATA_NUMBERS[];
}

export const StackedBar = ({ title, labels, data }: StackedBarProps) => {
	const chartData = {
		labels,
		datasets: data.map((moveItem, i) => ({
			labels: moveItem.name,
			data: moveItem.values,
			backgroundColor: COLORS[i % COLORS.length],
		})),
	};
	const options = {
		plugins: {
			legend: {
				position: "top" as const,
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
		<div className="w-full max-w-[800px] min-w-[500px] h-[500px] bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col">
			<h2 className="text-[20px] font-bold mb-4">{title}</h2>
			<div className="flex-1 flex justify-center items-center relative">
				<Bar data={chartData} options={options} />
			</div>
		</div>
	);
};
