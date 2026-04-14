import React from 'react';
import styled, { css } from 'styled-components';

const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
`;

const CheckCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  cursor: pointer;
  ${(props) =>
    props.isDone &&
    css`
      background: #7cc59a;      /* 내부를 초록색으로 채움 */
      border: 1px solid #7cc59a; /* 테두리도 초록색으로 */
      color: white;             /* 체크 표시(V)는 하얀색으로 */
    `}
`;

const Text = styled.div`
  flex: 1;
  color: #495057;
  font-size: 18px;
  ${(props) =>
    props.isDone && css`
    color: #ced4da;
    text-decoration: line-through;`
  }
`;

const Remove = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffc078;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    color: #ff922b;
  }
`;

function TodoItem({ todo, handlerToggleIsDone, handlerDeleteBtnClick }) {
  const { id, task, isDone } = todo;

  return (
    <TodoItemBlock>
      <CheckCircle isDone={isDone} onClick={() => handlerToggleIsDone(id)}>
        {isDone && '✔'}
      </CheckCircle>
      <Text isDone={isDone}>{task}</Text>
      <Remove onClick={() => handlerDeleteBtnClick(id)}>X</Remove>
    </TodoItemBlock>
  );
}
export default TodoItem;
