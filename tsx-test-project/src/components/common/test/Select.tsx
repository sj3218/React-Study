import type { ChangeEvent } from "react";

interface SelectProps {
	options: any[];
	value: string;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({ options, value, onChange }: SelectProps) => {
	return (
		<select value={value} onChange={onChange}>
			{options.map((option) => {
				return (
					<option key={option.id} value={option.category}>
						{option.category}
					</option>
				);
			})}
		</select>
	);
};
