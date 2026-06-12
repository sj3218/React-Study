import type React from "react";

export interface MenuItem {
	id: string;
	title: string;
	basePath: string;
	page: React.ComponentType;
}
