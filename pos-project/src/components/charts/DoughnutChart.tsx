import { COLORS, type DATA_NUMBER } from "../../constants/types";
import { Chart as chartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js";
import { Doughnut } from "react-chartjs-2";
chartJS.register(ArcElement, Tooltip, Legend, Colors);

interface DoughnutChartProps {
	title: string;
	data: DATA_NUMBER[];
}

export const DoughnutChart = ({ title, data }: DoughnutChartProps) => {
	const chartData = {
		labels: data.map((item) => item.name),
		datasets: [
			{
				data: data.map((item) => item.value),
				backgroundColor: COLORS,
				borderWidth: 0,
			},
		],
	};

	const options = {
		responsive: true, //차트를 반응형으로 설정
		maintainAspectRatio: false, //반응형일 경우, 원래 비율을 유지할지 설정
		cutout: "75%", //두께 조절
		plugins: {
			legend: { display: false },
			tooltip: { enabled: true },
			datalabels: {
				display: false,
			},
		},
	};

	return (
		<div className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col">
			<h2 className="text-[18px] font-bold mb-6 text-slate-800">{title}</h2>
			<div className="relative h-[220px] w-full mb-6 flex justify-center flex-none">
				<Doughnut data={chartData} options={options} />
			</div>
			<div className="flex-1 flex flex-col gap-2 overflow-y-auto  pr-1 custom-scrollbar min-h-0">
				{data.map((item, i) => (
					<div key={i} className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors shrink-0">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
							<span className="font-medium text-sm text-slate-600">{item.name}</span>
						</div>
						<span className="font-bold text-sm text-slate-900">{item.value.toLocaleString()}</span>
					</div>
				))}
			</div>
		</div>
	);
};
