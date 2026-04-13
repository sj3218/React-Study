import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import styled from 'styled-components';
import TodoList from './TodoList';

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

function TodoTemplate() {
  return (
    <Template>
      <TodoHeader />
      <TodoInput />
      <TodoList text="hello" done={false} />
    </Template>
  );
}

export default TodoTemplate;
