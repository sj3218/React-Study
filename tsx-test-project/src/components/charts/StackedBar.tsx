import { COLORS, type DATA_NUMBERS } from "../../types/types";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StackedBarProps {
	title: string;
	labels: string[];
	data: DATA_NUMBERS[];
}

export const StackedBar = ({ title, labels, data }: StackedBarProps) => {
	if(!data || data.length === 0)
	{
		return(
			<div className="w-full h-[500px] enterprise-card flex items-center justify-center">
                <p className="text-slate-400">데이터가 존재하지 않습니다.</p>
            </div>
		)
	}

	const chartData = {
		labels,
		datasets: data.map((moveItem, i) => ({
			label: moveItem.name,
			data: moveItem.values,
			backgroundColor: COLORS[i % COLORS.length],
			borderRadius: 4,
		})),
	};
	const options = {
		plugins: {
			legend: {
				position: "top" as const,
			},
			labels:{
				usePointStyle: true,
				padding: 20,
			}
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

	//옆으로 나열하는 버전
// 	const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//         mode: 'index' as const,
//         intersect: false,
//     },
//     plugins: {
//         legend: {
//             position: 'top' as const,
//             align: 'end' as const, // 범례를 오른쪽 상단으로 정렬
//             labels: {
//                 boxWidth: 10,
//                 boxHeight: 10,
//                 usePointStyle: true,
//                 font: { size: 12, weight: 'bold' }
//             }
//         },
//         tooltip: {
//             // 위에서 설명한 툴팁 커스텀 설정
//         }
//     },
//     scales: {
//         // 위에서 설명한 축(Axis) 커스텀 설정
//     },
//     // 애니메이션 효과 추가
//     animation: {
//         duration: 1000,
//         easing: 'easeOutQuart' as const,
//     }
// };

	return (
		<div className="w-full max-w-[800px]  h-[500px] bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col">
			<h2 className="text-[20px] font-bold mb-4">{title}</h2>
			<div className="flex-1 flex justify-center items-center relative">
				<Bar data={chartData} options={options} />
			</div>
		</div>
	);
};
