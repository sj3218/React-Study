import React from "react";
import styled from "styled-components";
import StatCard from "../components/charts/StatCard";
import DoughnutChart from "../components/charts/DoughnutChart";
import StackedBar from "../components/charts/StackedBar";
import { BiSolidLayer } from "react-icons/bi";
import { BiSolidLayerMinus } from "react-icons/bi";
import { BiSolidLayerPlus } from "react-icons/bi";
import { BiSmile } from "react-icons/bi";

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;

const StatCardsRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	padding: 40px;
	width: 100%;
	align-items: stretch;
	justify-items: center;
	@media (max-width: 600px) {
		grid-template-columns: 1fr 1fr;
	}
	@media (max-width: 1200px) {
		grid-template-columns: 1fr;
	}
`;

const ChartRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 20px;
	gap: 20px;
	width: 90%;
	height: 100%;
	align-items: stretch;
	justify-items: center;
	@media (max-width: 1200px) {
		grid-template-columns: 1fr;
	}
`;

function HomePage() {
	const doughnut_data = [
		{ name: "카카오", value: 28 },
		{ name: "전화", value: 12 },
		{ name: "인터넷", value: 34 },
		{ name: "API", value: 26 },
	];

	const stacked_bar_labels = ["09시", "10시", "11시", "12시", "13시", "14시", "15시", "16시", "17시"];

	const stacked_bar_data = [
		{
			name: "카카오",
			values: [102, 60, 151, 53, 29, 109, 25, 22, 85],
		},
		{
			name: "인터넷",
			values: [21, 29, 102, 148, 98, 50, 68, 164, 150],
		},
		{
			name: "전화",
			values: [80, 70, 60, 30, 50, 10, 10, 50, 100],
		},
		{
			name: "API",
			values: [70, 60, 51, 73, 19, 89, 55, 62, 45],
		},
	];
	return (
		<PageContainer>
			<StatCardsRow>
				<StatCard color="black" title="전체 건수" value="300" icon={BiSolidLayer} />
				<StatCard color="#6689c6" title="접수 건수" value="300" icon={BiSolidLayerPlus} />
				<StatCard color="#e85252" title="취소 건수" value="300" icon={BiSolidLayerMinus} />
				<StatCard color="#69b3a2" title="완료 건수" value="300" icon={BiSmile} />
			</StatCardsRow>
			<br />
			<br />
			<ChartRow>
				<StackedBar title="stacked bar" labels={stacked_bar_labels} data={stacked_bar_data} />
				<DoughnutChart title="doughnut chart" data={doughnut_data} />
			</ChartRow>
		</PageContainer>
	);
}

export default HomePage;
