import styled from "styled-components";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarContainer = styled.div`
	background: white;
	border-radius: 20px;
	padding: 24px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

	width: 800px;

	height: 500px;

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

function StackedBar({ title, labels, data }) {
	const colors = ["#e85252", "#6689c6", "#69b3a2", "#e0ac2b"];
	const chartData = {
		labels,
		datasets: data.map((item, i) => ({
			label: item.name,
			data: item.values,
			backgroundColor: colors[i % colors.length],
		})),
	};

	const options = {
		plugins: {
			legend: {
				position: "top",
			},
		},
		responsive: true,
		maintainAspectRation: false,
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
		<BarContainer>
			<Title>{title}</Title>
			<ChartArea>
				<Bar data={chartData} options={options} />
			</ChartArea>
		</BarContainer>
	);
}

export default StackedBar;
