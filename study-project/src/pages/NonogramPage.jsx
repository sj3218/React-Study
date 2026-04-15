import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sizes = { Easy: 5, Medium: 10, Hard: 30 };

function makePuzzle(size){
  const solution = Array.from({length:size},()=>Array.from({length:size},()=>Math.random()>0.55?1:0));
  const clues = (lines)=>lines.map(line=>{let arr=[];let c=0;for(const v of line){if(v){c++;}else if(c){arr.push(c);c=0;}} if(c) arr.push(c); return arr.length?arr:[0];});
  const rows = clues(solution);
  const cols = clues(Array.from({length:size},(_,x)=>Array.from({length:size},(_,y)=>solution[y][x])));
  return {solution,rows,cols};
}

export default function NonogramGame(){
  const [level,setLevel]=useState('Easy');
  const size=sizes[level] || 5;
  const [seed,setSeed]=useState(0);
  const puzzle=useMemo(()=>makePuzzle(size),[size,seed]);
  const createBoard=()=>Array.from({length:size},()=>Array(size).fill(0));
  const createMarks=()=>Array.from({length:size},()=>Array(size).fill(false));
  const [board,setBoard]=useState(createBoard);
  const [marks,setMarks]=useState(createMarks);
  const [started,setStarted]=useState(false);
  const [seconds,setSeconds]=useState(0);

  useEffect(()=>{
    setBoard(createBoard());
    setMarks(createMarks());
    setStarted(false);
    setSeconds(0);
  },[size,seed]);

  useEffect(()=>{
    if(!started) return;
    const id=setInterval(()=>setSeconds(s=>s+1),1000);
    return ()=>clearInterval(id);
  },[started]);

  const toggle=(r,c,e)=>{
    if(!started) return;
    e.preventDefault();
    if(!board[r] || !marks[r]) return;
    if(e.type==='contextmenu'){
      const copy=marks.map(row=>row.slice());
      copy[r][c]=!copy[r][c];
      setMarks(copy);
      return;
    }
    const copy=board.map(row=>row.slice());
    copy[r][c]=copy[r][c]?0:1;
    setBoard(copy);
  };

  const won = board.length===size && board.every((row,r)=>row.every((v,c)=>v===puzzle.solution[r][c]));

  useEffect(()=>{
    if(won) setStarted(false);
  },[won]);

  const isRowSolved=(r)=>board[r] && board[r].every((v,c)=>v===puzzle.solution[r][c]);
  const isColSolved=(c)=>board.every((row,r)=>row[c]===puzzle.solution[r][c]);
  const cellSize = size===30?18:size===10?28:42;
  const timeText=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

  return <div className='p-6 space-y-4'>
    <div className='flex gap-2 items-center flex-wrap'>
      {Object.keys(sizes).map(k=><Button key={k} variant={k===level?'default':'outline'} onClick={()=>setLevel(k)}>{k} ({sizes[k]}x{sizes[k]})</Button>)}
      <Button onClick={()=>setSeed(s=>s+1)}>New Puzzle</Button>
      <Button onClick={()=>setStarted(true)} disabled={started || won}>Start</Button>
      <div className='font-mono text-sm'>{timeText}</div>
    </div>
    {won && <div className='text-green-600 font-bold'>🎉 Clear!</div>}
    <Card><CardContent className='p-4 overflow-auto'>
      <div style={{display:'grid',gridTemplateColumns:`120px repeat(${size}, ${cellSize}px)`}}>
        <div></div>
        {puzzle.cols.map((clue,i)=><div key={i} className='text-xs text-center leading-3' style={{color:isColSolved(i)?'#9ca3af':'#111'}}>{clue.map((n,j)=><div key={j}>{n}</div>)}</div>)}
        {puzzle.rows.map((rowClue,r)=><React.Fragment key={r}>
          <div className='text-xs pr-2 flex items-center justify-end gap-1' style={{color:isRowSolved(r)?'#9ca3af':'#111'}}>{rowClue.map((n,j)=><span key={j}>{n}</span>)}</div>
          {Array.from({length:size},(_,c)=>{
            const filled=board[r]?.[c];
            const mark=marks[r]?.[c];
            return <div key={c} onClick={(e)=>toggle(r,c,e)} onContextMenu={(e)=>toggle(r,c,e)} className='border border-gray-400 flex items-center justify-center select-none cursor-pointer' style={{width:cellSize,height:cellSize,background:filled?'#111':'white',fontSize:cellSize*0.7}}>{!filled && mark?'×':''}</div>
          })}
        </React.Fragment>)}
      </div>
    </CardContent></Card>
    <div className='text-sm text-gray-500'>좌클릭: 칸 채우기 / 우클릭: X 표시</div>
  </div>
}
