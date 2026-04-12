import React from 'react';
import TodoTemplate from '../components/todo/TodoTemplate';
import styled from 'styled-components';

const StyledTodoPage = styled.div`
    background: lightgray;
    display: grid;
    min-height: 100vh;
    min-width: 100vw;
    grid-template-rows: auto 1fr;
`;
const Title = styled.h1`
    margin:20px;
    color:black;
    text-align:left;
`;

const ContentArea = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
`;

function TodoPage() {
    return(
        <StyledTodoPage>
            <Title>Todo Page</Title>
            <ContentArea>
                <TodoTemplate />
            </ContentArea>
        </StyledTodoPage>
    );
}

export default TodoPage;