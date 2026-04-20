import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartOptions } from "chart.js";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TestChartProps {
	title: string;
	subTitle: string;
	data: { day: string; logins: number; failures: number }[] | undefined;
}

export const TestChart = ({ title, subTitle, data }: TestChartProps) => {
	// 1. 데이터 가공 (Recharts의 [{...}] 형식을 Chart.js의 { datasets: [...] } 형식으로 변경)
	const chartData = {
		labels: data?.map((d) => d.day) || [],
		datasets: [
			{
				label: "LOGINS",
				data: data?.map((d) => d.logins) || [],
				backgroundColor: "#2563EB",
				borderRadius: 0, // 하단은 평평하게
				barThickness: 32,
			},
			{
				label: "FAILURES",
				data: data?.map((d) => d.failures) || [],
				backgroundColor: "#38BDF8",
				borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 }, // 상단만 둥글게
				barThickness: 32,
			},
		],
	};

	// 2. 옵션 설정
	const options: ChartOptions<"bar"> = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				stacked: true, // 스택형 막대 설정
				grid: { display: false },
				ticks: {
					font: { size: 11, weight: "normal" },
					color: "#64748B",
				},
				border: { display: false },
			},
			y: {
				stacked: true, // 스택형 막대 설정
				grid: { color: "#F1F5F9" },
				ticks: {
					font: { size: 11, weight: "normal" },
					color: "#64748B",
				},
				border: { display: false },
			},
		},
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
				align: "end" as const,
				labels: {
					usePointStyle: true,
					pointStyle: "circle",
					font: { size: 11, weight: "bold" },
					padding: 20,
				},
			},
			tooltip: {
				backgroundColor: "#fff",
				titleColor: "#1E293B",
				bodyColor: "#64748B",
				titleFont: { size: 11, weight: "bold" },
				bodyFont: { size: 12, weight: "bold" },
				padding: 12,
				borderColor: "#E2E8F0",
				borderWidth: 1,
				displayColors: true,
				boxPadding: 6,
			},
		},
	};

	return (
		<div className="border border-[#E2E8F0] rounded-2xl p-8 bg-white shadow-sm">
			<div className="flex items-center justify-between mb-10">
				<div className="space-y-1">
					<h4 className="font-bold text-base tracking-tight text-[#1E293B]">{title}</h4>
					<p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">{subTitle}</p>
				</div>
				<div className="flex items-center gap-3">
					<select className="bg-white border border-[#E2E8F0] rounded-lg px-4 py-2 text-xs font-bold text-[#1E293B] outline-none hover:bg-zinc-50 transition-colors cursor-pointer">
						<option>Last 24 Hours</option>
						<option>Last 7 Days</option>
					</select>
				</div>
			</div>

			<div className="h-[320px] w-full relative">
				{/* Recharts의 ResponsiveContainer 대신 부모 div에 h, w를 주고 Bar를 넣습니다. */}
				<Bar data={chartData} options={options} />
			</div>
		</div>
	);
};
