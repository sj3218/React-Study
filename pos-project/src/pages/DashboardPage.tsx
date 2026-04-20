import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { Statcard } from "../components/charts/Statcard";
import { StackedBar } from "../components/charts/Stackedbar";
import { DoughnutChart } from "../components/charts/Doughnutchart";
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
					<Statcard title="Total Logins (Today)" number={1111} icon={TrendingUp} option_text="12.4% from yesterday" option_color="#10B981" />
					<Statcard title="Active Sessions" number={222} option_text="Current live users" option_color="#10B981" />
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

				{/* Incident Table / Feed */}
				{/* <div className="enterprise-card overflow-hidden">
					<div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between">
						<h4 className="font-bold text-base tracking-tight text-[#1E293B]">Real-time Authentication Events</h4>
						<div className="flex gap-2">
							<div className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Auto-refreshing</div>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse min-w-[800px]">
							<thead>
								<tr className="bg-[#F8FAFC]">
									<th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#64748B] border-b border-[#E2E8F0]">Event ID</th>
									<th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#64748B] border-b border-[#E2E8F0]">Method</th>
									<th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#64748B] border-b border-[#E2E8F0]">Network Node</th>
									<th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#64748B] border-b border-[#E2E8F0]">Time</th>
									<th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#64748B] border-b border-[#E2E8F0]">Validation</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ id: "k.smith@corp.com", method: "OAuth2 / Google", node: "Seoul, KR", time: "14:22:05", status: "Success" },
									{ id: "j.lee@corp.com", method: "Direct SSO", node: "Busan, KR", time: "14:20:11", status: "Success" },
									{ id: "unknown_admin", method: "Password", node: "Unknown (Proxy)", time: "14:18:55", status: "Flagged", critical: true },
									{ id: "m.park@corp.com", method: "SAML / Azure", node: "Seoul, KR", time: "14:15:33", status: "Success" },
								].map((row, i) => (
									<tr key={i} className="hover:bg-zinc-50/50 transition-colors">
										<td className="px-8 py-4 text-sm font-bold text-[#1E293B] border-b border-[#F1F5F9]">{row.id}</td>
										<td className="px-8 py-4 text-xs font-semibold text-[#64748B] border-b border-[#F1F5F9]">{row.method}</td>
										<td className="px-8 py-4 text-xs font-mono text-[#64748B] border-b border-[#F1F5F9]">{row.node}</td>
										<td className="px-8 py-4 text-xs font-bold text-[#64748B] border-b border-[#F1F5F9]">{row.time}</td>
										<td className="px-8 py-4 border-b border-[#F1F5F9]">
											<span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block", row.critical ? "bg-red-100 text-red-700" : "bg-[#E0F2FE] text-[#0369A1]")}>{row.status}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default DashboardPage;
