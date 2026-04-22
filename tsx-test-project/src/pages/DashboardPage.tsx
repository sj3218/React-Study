import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { Statcard } from "../components/charts/Statcard";
import { StackedBar } from "../components/charts/StackedBar";
import { DoughnutChart } from "../components/charts/DoughnutChart";
import { TestChart } from "../components/charts/TestChart";

const DashboardPage = () => {
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
	const doughnut_data = [
		{ name: "카카오", value: 28 },
		{ name: "전화", value: 12 },
		{ name: "인터넷", value: 34 },
		{ name: "API", value: 26 },
	];
	const test_data = [
		{ day: "mon", logins: 11, failures: 1 },
		{ day: "tue", logins: 3, failures: 10 },
		{ day: "wed", logins: 5, failures: 11 },
		{ day: "thu", logins: 12, failures: 21 },
		{ day: "fri", logins: 22, failures: 1 },
		{ day: "sat", logins: 31, failures: 3 },
		{ day: "sun", logins: 13, failures: 7 },
	];

	return (
		<div className="px-10 py-8 flex-1">
			<div className="space-y-8">
				{/* Key Metrics */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<Statcard title="Total Logins (Today)" number={1111} unit="명" icon={TrendingUp} option_text="12.4% from yesterday" option_color="text-lime-600" />
					<Statcard title="Active Sessions" number={222} option_text="Current live users" option_color="text-lime-600" />
					<Statcard title="AVG Today" number={333} />
					<Statcard title="AVG Yesterday" number={444} option_text="Yesterday live users" />
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<StackedBar title="1" labels={stacked_bar_labels} data={stacked_bar_data} />
					<StackedBar title="2" labels={stacked_bar_labels} data={stacked_bar_data} />
					<DoughnutChart title="doughnut" data={doughnut_data} />
					<TestChart title="Number of Logins" subTitle="Muyaho~" data={test_data} />
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
