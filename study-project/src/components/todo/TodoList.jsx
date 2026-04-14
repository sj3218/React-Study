import styled, { css } from 'styled-components';
import TodoItem from './TodoItem';
import { useState } from 'react';
import { isDocument } from '@testing-library/user-event/dist/utils';

const TodoListBlock = styled.div`
  flex: 1;
  padding: 10px 25px;
  padding-bottom: 32px;
  overflow-y: auto;
`;

function TodoList({ todos, setTodos }) {
  const handlerToggleIsDone = (id) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo));
    setTodos(updatedTodos);
    console.log(todos);
  };

  const handlerDeleteBtnClick = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    console.log(todos);
  };

  return (
    <TodoListBlock>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handlerToggleIsDone={handlerToggleIsDone}
          handlerDeleteBtnClick={handlerDeleteBtnClick}
        />
      ))}
    </TodoListBlock>
  );
}

export default TodoList;
