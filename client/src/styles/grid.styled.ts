import styled, { css } from "styled-components";

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 280px;
  aspect-ratio: 1;
  margin: 1rem auto;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  ._0 {
    border-bottom: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
    border-right: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
  }
  
  ._2 {
    border-bottom: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
    border-left: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
  }
  
  ._4 {
    box-shadow: 0 0 0 ${({theme}) => theme.border} ${({ theme }) => theme.colors.line};
  }
  
  ._6 {
    border-top: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
    border-right: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
  }
  
  ._8 {
    border-top: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
    border-left: ${({theme}) => theme.border} solid ${({ theme }) => theme.colors.line};
  }
`;

export default StyledGrid;
