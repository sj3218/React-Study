import styled from "styled-components";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
ChartJS.defaults.set("plugins.datalabels", {
	display: false,
});

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const HorizontalBarContainer = styled.div`
	background: white;
	border-radius: 20px;
	padding: 24px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	width: 800px;
	height: 300px;
	display: flex;
	flex-direction: column;
`;

const TitleText = styled.div`
	font-size: 20px;
	font-weight: bold;
`;

const ChartArea = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

interface ChartDataItem {
	name: string;
	value: number;
}

interface HorizontalBarProps {
	title: string;
	data: ChartDataItem[];
	max: number | string; //최대 값
	maxBarThickness: number; //바 두께
	background: string; //색깔
	showLabels: boolean; //데이터 레이블 표시 여부
	labelsColor?: string; //레이블 색상
	labelsSize?: number; //레이블 사이즈
	layoutPadding?: number; //패딩값
}

function HorizontalBar({ title, data, max, maxBarThickness, background, showLabels, labelsColor, labelsSize, layoutPadding }: HorizontalBarProps) {
	const colors = ["#ff0000", "#ffbb00", "#ffee00", "#00ff37", "#0400ff", "#b700ff", "#838383"];
	const chartData = {
		labels: data?.map((item) => item.name) || 0, // ["total", "done", "undone"]
		datasets: [
			{
				data: data?.map((item) => item.value) || 0, // [100, 20, 80]
				maxBarThickness: maxBarThickness,
				backgroundColor: background, // 단일 색상 혹은 배열 가능
				borderRadius: 10,
				borderSkipped: false,
				barPercentage: 0.9, // 바 자체의 너비 (1.0이면 꽉 참)
				categoryPercentage: 0.8, // 바가 들어가는 영역의 너비 (값이 클수록 축 간격이 좁아짐)
			},
		],
	};

	const options: ChartOptions<"bar"> = {
		responsive: true,
		maintainAspectRatio: false, // 비율 유지 비활성화
		layout: {
			padding: layoutPadding || 0,
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: false,
			},
			datalabels: {
				display: showLabels, // 데이터 레이블 활성화
				color: labelsColor, // 텍스트 색상
				clip: false, // 잘리지 않도록 설정
				align: "end", // 텍스트 정렬
				anchor: "end", // 텍스트 위치
				formatter: (value: number | string) => value, // 레이블 포맷
				font: {
					weight: "bold", // 텍스트 굵기
					size: labelsSize || 12, // 텍스트 크기
				},
			},
		},
		indexAxis: "y", // 명시적으로 타입 선언
		scales: {
			x: {
				display: false,
				min: 0, // x축의 최소값을 0으로 설정
				max: typeof max === "number" ? max : parseFloat(max),
				ticks: {
					stepSize: 1, // x축의 간격을 1로 설정
				},
			},
			y: {
				display: true,
				grid: {
					display: false,
				},
				ticks: {
					stepSize: 1, // y축의 간격을 1로 설정
					font: {
						size: 20,
						weight: "bold",
						lineHeight: 1.5,
					},
				},
			},
		},
	};
	console.log(data);
	return (
		<HorizontalBarContainer>
			<TitleText>{title}</TitleText>
			<ChartArea>
				<Bar data={chartData} options={options} />
			</ChartArea>
		</HorizontalBarContainer>
	);
}

export default HorizontalBar;
