import React from "react";
import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const ChartContainer = styled.div`
	background: white;
	border-radius: 20px;
	padding: 24px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

	width: 500px;
	max-width: 500px;
	aspect-ratio: 1;

	display: flex;
	flex-direction: column;
`;

const Title = styled.div`
	font-size: 20px;
	font-weight: bold;
`;

const ChartArea = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const NameCardArea = styled.div`
	flex: 0 0 25%;
	display: flex;
	flex-direction: column;
	gap: 8px;
	overflow-y: auto;
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 12px;
	border-radius: 10px;
	background: #f5f5f5;
`;

const Label = styled.div`
	font-weight: bold;
`;

const Value = styled.div`
	font-weight: bold;
`;

function DoughnutChart({ title, size, data }) {
	const chartData = {
		labels: data.map((item) => item.name),
		datasets: [
			{
				data: data.map((item) => item.value),
				backgroundColor: ["#e85252", "#6689c6", "#69b3a2", "#e0ac2b"],
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
			// colors: { enabled: false }, //using default color set
		},
	};

	return (
		<ChartContainer>
			<Title>{title}</Title>
			<ChartArea>
				<div style={{ width: "95%", height: "95%" }}>
					<Doughnut data={chartData} options={options} width={size} height={size} />
				</div>
			</ChartArea>
			<NameCardArea>
				{data.map((item, i) => (
					<Row key={i}>
						<Label>{item.name}</Label>
						<Value>{item.value}%</Value>
					</Row>
				))}
			</NameCardArea>
		</ChartContainer>
	);
}

export default DoughnutChart;
