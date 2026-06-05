import type React from "react";

export interface MenuItem {
	id: string;
	title: string;
	url: string;
	page: React.ComponentType;
}
