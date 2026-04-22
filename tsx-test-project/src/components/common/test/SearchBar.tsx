import { useState, type ChangeEvent } from "react";

export interface SearchBarProps {
	query: string;
	setQuery: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const SearchBar = ({ query, setQuery }: SearchBarProps) => {
	return <input type="text" placeholder="Enter name" value={query} onChange={setQuery} className="w-full h-15 px-5 border-3 border-orange-200 rounded-xl focus:outline-none"></input>;
};
