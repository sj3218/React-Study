import styled, { css } from 'styled-components';
import TodoItem from '../TodoItem';
import { useState } from 'react';

const TodoListBlock = styled.div`
  flex: 1;
  padding: 10px 25px;
  padding-bottom: 32px;
  overflow-y: auto;
`;

const initialTodos = [
  { id: '1', isDone: false, content: 'C++', date: Date.now() },
  { id: '2', idDone: false, content: 'React', date: Date.now() }
];

function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  return (
    <TodoListBlock>
      <TodoItem text="hello" />
    </TodoListBlock>
  );
}

export default TodoList;
