import styled from 'styled-components';

const HeaderContainer = styled.div`
  padding: 48px 32px 24px 32px;
  border-bottom: 1px solid #e9ecef;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 36px;
  color: black;
`;

const DateText = styled.span`
  font-size: 21px;
  color: lightgray;
`;

const TasksLeft = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #ff8787;
  font-weight: bold;
`;

function TodoHeader({ todos }) {
  const undoneTasks = todos.filter((todo) => !todo.isDone);
  //안한일 개수 정리
  return (
    <HeaderContainer>
      <Header>
        <Title>Todo List</Title>
        <DateText>{new Date().toLocaleDateString()}</DateText>
      </Header>
      <TasksLeft>할 일 {undoneTasks.length}개 남음</TasksLeft>
    </HeaderContainer>
  );
}

export default TodoHeader;
