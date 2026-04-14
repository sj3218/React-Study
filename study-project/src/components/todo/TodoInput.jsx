import { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
`;

const StyledInput = styled.input`
    flex: 1;
    padding 12px;
    border:none;
    border-bottom: 1px solid #dee2e6;
    outline: none;
    font-size: 18px;
    
    &::placeholder{
        color: lightgray;
        margin: 10px;
    }    
`;

const AddButton = styled.button`
  margin: 10px;
  padding: 10px 25px;
  background: white;
  border: 1px solid black;
  display: block;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }
`;

function TodoInput({ todos, setTodos }) {
  const [newTask, setNewTask] = useState('');
  const handlerValueChange = (event) => {
    setNewTask(event.target.value);
  };
  const handlerAddBtnClick = () => {
    if (newTask.trim() !== '') {
      const newTodo = {
        id: uuid4(),
        task: newTask,
        isDone: false
      };
      setTodos([...todos, newTodo]);
      setNewTask('');
      console.log('add task');
    }
  };
  const handlerKeyDown = (event) =>{
    if(event.key === 'Enter')
    {
      handlerAddBtnClick();
    }
  };

  return (
    <InputContainer>
      <StyledInput placeholder="input your task" value={newTask} onChange={handlerValueChange} onKeyDown = {handlerKeyDown}/>
      <AddButton classname="add-box" onClick={handlerAddBtnClick}>
        Add
      </AddButton>
    </InputContainer>
  );
}

export default TodoInput;
