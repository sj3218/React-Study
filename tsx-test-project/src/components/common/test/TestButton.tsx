import { useRef, useState, type ChangeEvent } from "react";

interface Inputs {
	begin: number;
	end: number;
}

interface TestButtonProps {
	inputs: Inputs;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onCheck: () => void;
}

export const TestButton = ({ inputs, onChange, onCheck }: TestButtonProps) => {
	return (
		<div className="flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-full shadeow-sm">
			<input name="begin" placeholder="begin" onChange={onChange} value={inputs.begin} className="border p-1 w-12 text-center" />
			<div className="px-3">~</div>
			<input name="end" placeholder="end" onChange={onChange} value={inputs.end} className="border p-1 w-12 text-center" />
			<button onClick={onCheck} className="ml-3 px-2 py-1 border rounded-lg bg-blue-500 text-white flex items-center hover:bg-blue-600">
				조회
			</button>
		</div>
	);
};
