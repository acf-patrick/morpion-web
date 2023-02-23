import styled, { css } from "styled-components";

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 280px;
  aspect-ratio: 1;
  margin: 0 auto;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ._0 {
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    border-right: 1px solid ${({ theme }) => theme.colors.line};
  }
  
  ._2 {
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    border-left: 1px solid ${({ theme }) => theme.colors.line};
  }
  
  ._4 {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.line};
  }
  
  ._6 {
    border-top: 1px solid ${({ theme }) => theme.colors.line};
    border-right: 1px solid ${({ theme }) => theme.colors.line};
  }
  
  ._8 {
    border-top: 1px solid ${({ theme }) => theme.colors.line};
    border-left: 1px solid ${({ theme }) => theme.colors.line};
  }
`;

export default StyledGrid;
