import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import DoughnutChart from "../components/charts/DoughnutChart";
import HorizontalBar from "../components/charts/HorizontalBar";

const StatisticsPageContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;

const ButtonArea = styled.div`
	display: flex;
	flex-direction: row;
`;

const Text = styled.div`
	font-size: 14px;
`;
const Button = styled.button`
	color: #bf4f74;
	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 3px solid #bf4f74;
	border-radius: 3px;
	height: 50px;
	&:hover {
		background: #cacaca;
	}
`;

function StatisticsPage() {
	const [allTodos, setAllTodos] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(1);
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setAllTodos(null);
				const response = await axios.get(process.env.REACT_APP_JSONPLACEHOLDER_SERVER_TODOS_URL);
				setAllTodos(response.data);
			} catch (e) {}
		};
		fetchData();
	}, []);

	if (!allTodos) {
		return <Text>no data...</Text>;
	}

	const statsByUserId = allTodos.reduce((acc, cur) => {
		const { userId, completed } = cur;
		if (!acc[userId]) {
			acc[userId] = { total: 0, done: 0, undone: 0 };
		}

		acc[userId].total++;

		if (completed) {
			acc[userId].done++;
		} else {
			acc[userId].undone++;
		}
		return acc;
	}, {});

	console.log(statsByUserId);

	const onClick = (id) => {
		setSelectedUserId(id);
		const data = [
			{ name: "done", value: statsByUserId[selectedUserId].done },
			{ name: "undone", value: statsByUserId[selectedUserId].undone },
		];
		setChartData(data);
		// console.log(data);
	};

	return (
		<StatisticsPageContainer>
			<ButtonArea>
				<Button onClick={() => onClick("1")}>user 1</Button>
				<Button onClick={() => onClick("2")}>user 2</Button>
				<Button onClick={() => onClick("3")}>user 3</Button>
				<Button onClick={() => onClick("4")}>user 4</Button>
				<Button onClick={() => onClick("5")}>user 5</Button>
				<Button onClick={() => onClick("6")}>user 6</Button>
				<Button onClick={() => onClick("7")}>user 7</Button>
				<Button onClick={() => onClick("8")}>user 8</Button>
				<Button onClick={() => onClick("9")}>user 9</Button>
				<Button onClick={() => onClick("10")}>user 10</Button>
			</ButtonArea>

			<DoughnutChart title={selectedUserId} size="200" data={chartData} />
			<HorizontalBar title={selectedUserId} data={chartData} max={22} maxBarThickness={20} background="#6D72FF" showLabels={true} labelsColor="#000000" lablesSize={10} />
		</StatisticsPageContainer>
	);
}

export default StatisticsPage;
