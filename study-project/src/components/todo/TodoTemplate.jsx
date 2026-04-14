import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import styled from 'styled-components';
import TodoList from './TodoList';
import { useState } from 'react';

const Template = styled.div`
  width: 500px;
  height: 680px;
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
`;

const initialTodos = [
  { id: '1', isDone: false, task: 'C++', date: Date.now() },
  { id: '2', idDone: false, task: 'React', date: Date.now() }
];

function TodoTemplate() {
  const [todos, setTodos] = useState(initialTodos);

  return (
    <Template>
      <TodoHeader todos={todos}/>
      <TodoInput todos={todos} setTodos={setTodos} />
      <TodoList todos={todos} setTodos={setTodos} />
    </Template>
  );
}

export default TodoTemplate;
