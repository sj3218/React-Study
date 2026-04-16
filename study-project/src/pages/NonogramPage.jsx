// NonogramPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

/* =========================
   퍼즐 데이터
========================= */
const PUZZLES = {
	"5x5": [
		[
			[1, 1, 1, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 1, 1, 1],
		],
		[
			[0, 1, 1, 1, 0],
			[1, 0, 0, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 0, 0, 1],
			[0, 1, 1, 1, 0],
		],
		[
			[0, 0, 1, 0, 0],
			[0, 1, 1, 1, 0],
			[1, 1, 1, 1, 1],
			[0, 1, 1, 1, 0],
			[0, 0, 1, 0, 0],
		],
	],

	"10x10": Array(3)
		.fill()
		.map((_, idx) => Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => (idx === 0 ? (r === c || r + c === 9 ? 1 : 0) : idx === 1 ? (r > 2 && r < 7 && c > 2 && c < 7 ? 1 : 0) : r % 2 === 0 && c % 2 === 0 ? 1 : 0)))),

	"20x20": Array(3)
		.fill()
		.map((_, idx) => Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => (idx === 0 ? (r === c || r + c === 19 ? 1 : 0) : idx === 1 ? (r > 4 && r < 15 && c > 4 && c < 15 ? 1 : 0) : (r + c) % 3 === 0 ? 1 : 0)))),
};

/* =========================
   유틸
========================= */
const createBoard = (size) => Array.from({ length: size }, () => Array(size).fill(0)); // 0 빈칸 / 1 채움 / 2 X

const calcHint = (line) => {
	const arr = [];
	let cnt = 0;

	for (let v of line) {
		if (v === 1) cnt++;
		else {
			if (cnt) arr.push(cnt);
			cnt = 0;
		}
	}

	if (cnt) arr.push(cnt);
	return arr.length ? arr : [0];
};

const sameHint = (a, b) => JSON.stringify(calcHint(a)) === JSON.stringify(calcHint(b));

/* =========================
   컴포넌트
========================= */
const NonogramPage = () => {
	const [difficulty, setDifficulty] = useState("5x5");
	const [index, setIndex] = useState(0);

	const puzzle = useMemo(() => {
		return PUZZLES[difficulty]?.[index] || PUZZLES[difficulty][0];
	}, [difficulty, index]);

	const size = puzzle.length;

	const [board, setBoard] = useState(() => createBoard(size));

	const [running, setRunning] = useState(false);
	const [time, setTime] = useState(0);
	const timer = useRef(null);

	const [clear, setClear] = useState(false);

	/* 퍼즐 바뀌면 초기화 */
	useEffect(() => {
		setBoard(createBoard(size));
		setRunning(false);
		setTime(0);
		setClear(false);
	}, [difficulty, index, size]);

	/* 타이머 */
	useEffect(() => {
		if (running) {
			timer.current = setInterval(() => {
				setTime((prev) => prev + 1);
			}, 1000);
		} else {
			clearInterval(timer.current);
		}

		return () => clearInterval(timer.current);
	}, [running]);

	/* 승리 체크 */
	useEffect(() => {
		let success = true;

		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				const answer = puzzle[r][c];
				const current = board[r]?.[c] === 1 ? 1 : 0;

				if (answer !== current) {
					success = false;
					break;
				}
			}
		}

		if (success) {
			setRunning(false);
			setClear(true);
		}
	}, [board, puzzle, size]);

	const format = () => {
		const m = String(Math.floor(time / 60)).padStart(2, "0");
		const s = String(time % 60).padStart(2, "0");
		return `${m}:${s}`;
	};
	// 기존 NonogramPage.jsx 의 autoSolve 함수 + 보조 함수 교체본
	// 정답 puzzle 직접 참고하지 않고 "힌트 숫자" 기준 후보 계산 자동완성

	/* =====================================================
   후보 생성 함수
   hint: [1,1,1]
   length: 5
   return:
   [
     [1,2,1,2,1]
   ]
   1=검정, 2=X
===================================================== */
	const generatePatterns = (hint, length) => {
		const result = [];

		const dfs = (idx, pos, arr) => {
			if (idx === hint.length) {
				const temp = [...arr];
				while (temp.length < length) temp.push(2);
				result.push(temp);
				return;
			}

			const block = hint[idx];

			// 남은 블럭 최소 필요칸
			let remainNeed = 0;
			for (let i = idx + 1; i < hint.length; i++) {
				remainNeed += hint[i];
			}
			remainNeed += hint.length - idx - 1; // 사이 X칸

			for (let start = pos; start <= length - block - remainNeed; start++) {
				const temp = [...arr];

				while (temp.length < start) temp.push(2);

				for (let i = 0; i < block; i++) temp.push(1);

				if (idx !== hint.length - 1) temp.push(2);

				dfs(idx + 1, temp.length, temp);
			}
		};

		if (hint.length === 1 && hint[0] === 0) {
			return [Array(length).fill(2)];
		}

		dfs(0, 0, []);
		return result;
	};

	/* =====================================================
   현재 상태와 후보 충돌 검사
   board:
   0 빈칸
   1 검정
   2 X
===================================================== */
	const matchPattern = (line, pattern) => {
		for (let i = 0; i < line.length; i++) {
			if (line[i] === 1 && pattern[i] !== 1) return false;
			if (line[i] === 2 && pattern[i] !== 2) return false;
		}
		return true;
	};

	/* =====================================================
   공통칸 추출
===================================================== */
	const mergeCommon = (patterns) => {
		const len = patterns[0].length;
		const result = [];

		for (let i = 0; i < len; i++) {
			const val = patterns[0][i];
			let same = true;

			for (let j = 1; j < patterns.length; j++) {
				if (patterns[j][i] !== val) {
					same = false;
					break;
				}
			}

			result.push(same ? val : 0);
		}

		return result;
	};

	/* =====================================================
   메인 자동완성
===================================================== */
	const autoSolve = (grid) => {
		const next = grid.map((row) => [...row]);

		/* ---------------- 행 ---------------- */
		for (let r = 0; r < size; r++) {
			const hint = rowHints[r];
			const current = next[r];

			const patterns = generatePatterns(hint, size).filter((p) => matchPattern(current, p));

			if (patterns.length === 0) continue;

			const merged = mergeCommon(patterns);

			for (let c = 0; c < size; c++) {
				if (next[r][c] === 0 && merged[c] !== 0) {
					next[r][c] = merged[c];
				}
			}
		}

		/* ---------------- 열 ---------------- */
		for (let c = 0; c < size; c++) {
			const hint = colHints[c];

			const current = [];
			for (let r = 0; r < size; r++) current.push(next[r][c]);

			const patterns = generatePatterns(hint, size).filter((p) => matchPattern(current, p));

			if (patterns.length === 0) continue;

			const merged = mergeCommon(patterns);

			for (let r = 0; r < size; r++) {
				if (next[r][c] === 0 && merged[r] !== 0) {
					next[r][c] = merged[r];
				}
			}
		}

		return next;
	};

	/* 클릭 */
	/* 클릭 */
	const leftClick = (r, c) => {
		if (clear) return;

		setBoard((prev) => {
			const copy = prev.map((row) => [...row]);

			// 왼쪽 클릭 = 검정칸 토글
			copy[r][c] = copy[r][c] === 1 ? 0 : 1;

			return copy; // autoSolve 제거
		});
	};

	const rightClick = (e, r, c) => {
		e.preventDefault();
		if (clear) return;

		setBoard((prev) => {
			const copy = prev.map((row) => [...row]);

			// 오른쪽 클릭 = X 토글
			copy[r][c] = copy[r][c] === 2 ? 0 : 2;

			return copy; // autoSolve 제거
		});
	};

	/* 힌트 */
	const rowHints = puzzle.map((row) => calcHint(row));

	const colHints = Array.from({ length: size }, (_, c) => {
		const col = [];
		for (let r = 0; r < size; r++) col.push(puzzle[r][c]);
		return calcHint(col);
	});

	const rowSolved = (r) => {
		const current = board[r].map((v) => (v === 1 ? 1 : 0));
		return sameHint(current, puzzle[r]);
	};

	const colSolved = (c) => {
		const cur = [];
		const ans = [];

		for (let r = 0; r < size; r++) {
			cur.push(board[r][c] === 1 ? 1 : 0);
			ans.push(puzzle[r][c]);
		}

		return sameHint(cur, ans);
	};

	return (
		<Container>
			<Title>NONOGRAM</Title>

			{/* 난이도 */}
			<Menu>
				{["5x5", "10x10", "20x20"].map((lv) => (
					<Btn
						key={lv}
						active={difficulty === lv}
						onClick={() => {
							setIndex(0);
							setDifficulty(lv);
						}}
					>
						{lv}
					</Btn>
				))}
			</Menu>

			{/* 퍼즐 선택 */}
			<Menu>
				{PUZZLES[difficulty].map((_, i) => (
					<Btn key={i} active={index === i} onClick={() => setIndex(i)}>
						퍼즐 {i + 1}
					</Btn>
				))}
			</Menu>

			{/* 컨트롤 */}
			<Menu>
				<Btn onClick={() => setRunning(true)}>시작</Btn>
				<Btn onClick={() => setRunning(false)}>중단</Btn>
				<Btn onClick={() => setBoard(createBoard(size))}>다시하기</Btn>
				<Time>{format()}</Time>
			</Menu>

			{clear && <ClearText>🎉 CLEAR! 🎉</ClearText>}

			{/* board mismatch 방지 */}
			{board.length === size && (
				<BoardWrap>
					{/* 상단 힌트 */}
					<TopHints size={size}>
						<div />
						{colHints.map((hint, c) => (
							<HintCol key={c}>
								{hint.map((n, i) => (
									<Hint key={i} solved={colSolved(c)}>
										{n}
									</Hint>
								))}
							</HintCol>
						))}
					</TopHints>

					{/* 행 */}
					{Array.from({ length: size }).map((_, r) => (
						<Row key={r}>
							<LeftHint>
								{rowHints[r].map((n, i) => (
									<Hint key={i} solved={rowSolved(r)}>
										{n}
									</Hint>
								))}
							</LeftHint>

							<Grid size={size}>
								{Array.from({ length: size }).map((_, c) => (
									<Cell key={c} filled={board[r][c] === 1} onClick={() => leftClick(r, c)} onContextMenu={(e) => rightClick(e, r, c)}>
										{board[r][c] === 2 ? "✕" : ""}
									</Cell>
								))}
							</Grid>
						</Row>
					))}
				</BoardWrap>
			)}
		</Container>
	);
};

export default NonogramPage;

/* =========================
   styled
========================= */

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	background: #111;
	color: white;
	padding: 30px;
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h1`
	margin-bottom: 20px;
`;

const Menu = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 14px;
	flex-wrap: wrap;
	justify-content: center;
`;

const Btn = styled.button`
	padding: 10px 16px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	color: white;
	background: ${({ active }) => (active ? "#4caf50" : "#333")};

	&:hover {
		opacity: 0.9;
	}
`;

const Time = styled.div`
	font-size: 20px;
	font-weight: bold;
`;

const ClearText = styled.h2`
	color: gold;
	margin-bottom: 20px;
`;

const BoardWrap = styled.div`
	margin-top: 20px;
`;

const TopHints = styled.div`
	display: grid;
	grid-template-columns: 70px repeat(${({ size }) => size}, 34px);
`;

const HintCol = styled.div`
	min-height: 70px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
`;

const Row = styled.div`
	display: flex;
`;

const LeftHint = styled.div`
	width: 70px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 4px;
	padding-right: 8px;
`;

const Hint = styled.div`
	font-size: 14px;
	color: ${({ solved }) => (solved ? "#777" : "#fff")};
	font-weight: bold;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(${({ size }) => size}, 34px);
`;

const Cell = styled.div`
	width: 34px;
	height: 34px;
	border: 1px solid #666;
	background: ${({ filled }) => (filled ? "#000" : "#fff")};
	color: red;
	font-weight: bold;
	cursor: pointer;
	user-select: none;

	display: flex;
	align-items: center;
	justify-content: center;
`;
