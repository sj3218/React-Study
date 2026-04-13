import styled from "styled-components";

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
function TodoInput() {
  return (
    <InputContainer>
      <StyledInput placeholder="input your task" />
      <AddButton>Add </AddButton>
    </InputContainer>
  );
}

export default TodoInput;
