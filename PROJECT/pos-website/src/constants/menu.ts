import { FlaskConical, type LucideIcon } from "lucide-react";
import TestPage from "../pages/TestPage";
import type { MenuItem } from "../types/menu";

interface MenuGroup {
	id: string;
	title: string;
	icon: LucideIcon;
	children: MenuItem[];
}

export const MENU_LIST: MenuGroup[] = [
	{
		id: "0",
		title: "Test",
		icon: FlaskConical,
		children: [
			{ id: "0", title: "TestPage1", url: "/testpage", page: TestPage },
			{ id: "1", title: "TestPage2", url: "/testpage", page: TestPage },
			{ id: "2", title: "TestPage3", url: "/testpage", page: TestPage },
		],
	},
];
