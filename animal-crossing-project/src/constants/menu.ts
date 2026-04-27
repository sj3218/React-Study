import type React from "react";
import { v4 as uuidv4 } from "uuid";
import { DashboardPage } from "../page/DashboardPage";
import { VilligersPage } from "../page/VilligersPage";
import { House, UserRound, type LucideIcon } from "lucide-react";

interface MenuItem {
	id: string;
	title: string;
	url: string;
	icon: LucideIcon;
	page: React.ComponentType;
}

export const MENU_LIST: MenuItem[] = [
	{ id: uuidv4(), title: "Dashboard", url: "/", icon: House, page: DashboardPage },
	{ id: uuidv4(), title: "Villigers", url: "/villigers", icon: UserRound, page: VilligersPage },
];
