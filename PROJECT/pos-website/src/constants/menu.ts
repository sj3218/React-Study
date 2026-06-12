import { FlaskConical, type LucideIcon } from "lucide-react";
import TestPage from "../pages/TestPage";
import type { MenuItem } from "../types/menu";
import { v4 as uuidv4 } from "uuid";

interface MenuGroup {
	id: string;
	title: string;
	icon: LucideIcon;
	children: MenuItem[];
}

const RAW_MENU_LIST: MenuGroup[] = [
	{
		id: "0",
		title: "Test",
		icon: FlaskConical,
		children: [
			{ id: uuidv4(), title: "TestPage1", basePath: "/testpage", page: TestPage },
			{ id: uuidv4(), title: "TestPage2", basePath: "/testpage", page: TestPage },
			{ id: uuidv4(), title: "TestPage3", basePath: "/testpage", page: TestPage },
		],
	},
];

export const MENU_LIST = RAW_MENU_LIST.map((group) => ({
	...group,
	children: group.children.map((child) => ({
		id: child.id,
		title: child.title,
		page: child.page,
		url: `${child.basePath}/${child.id}`,
		pathPattern: `${child.basePath}/:id`,
	})),
}));
