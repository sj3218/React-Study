import { COLORS, type DATA_NUMBER } from "../../types/types";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartOptions, Colors, plugins } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
ChartJS.defaults.set("plugins.datalabels", {
	display: false,
});

interface StandardBarProps {
	title: string;
	axis: "x" | "y";
	data: DATA_NUMBER[];
}

export const StandardBar = ({ title, axis = "x", data }: StandardBarProps) => {
	const chartData = {
		labels: data?.map((item) => item.name) || [], // ["total", "done", "undone"]
		datasets: [
			{
				data: data?.map((item) => item.value) || [], // [100, 20, 80]
				backgroundColor: COLORS,
				borderRadius: 10,
				borderSkipped: false,
				barPercentage: 0.3, // 바 자체의 너비 (1.0이면 꽉 참)
				categoryPercentage: 0.8, // 바가 들어가는 영역의 너비 (값이 클수록 축 간격이 좁아짐)
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRation: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: false,
			},
			datalabels: {
				display: false,
				clip: false,
				align: "end",
				anchor: "end",
				formatter: (value: number | string) => value,
				font: {
					weight: "bold",
					size: 5,
				},
			},
		},
		indexAxis: axis,
	};

	return (
		<div className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col">
			<h2 className="text-[18px] font-bold mb-6 text-slate-800">{title}</h2>
			<div className="relative h-[220px] w-full mb-6 flex justify-center">
				<Bar data={chartData} options={options} />
			</div>
		</div>
	);
};
