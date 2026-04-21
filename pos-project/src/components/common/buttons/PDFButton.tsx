import { CSVLink } from "react-csv";
import { transformTodoStatsForCSV } from "../../../utils/DataTransform";

interface PDFButtonProps {
	data: any[];
}
export const PDFButton = ({ data }: PDFButtonProps) => {
	const headers = [
		{ label: "userId", key: "userId" },
		{ label: "완료", key: "done" },
		{ label: "미완료", key: "undone" },
	];

	const dataForCSV = transformTodoStatsForCSV(data);

	return (
		<CSVLink data={dataForCSV} headers={headers} filename={"통계_리포트.csv"} className="bg-green-600 text-white px-4 py-2 rounded">
			CSV 다운로드
		</CSVLink>
	);
};
