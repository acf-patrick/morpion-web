import styled from "styled-components";

const StyledContainer = styled.div`
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;

  .inner {
    max-width: ${({ theme }) => theme.sizes.maxWidth};
    max-height: ${({ theme }) => theme.sizes.maxHeight};
    flex-grow: 1;

    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.background};
  }

  h1 {
    margin-top: 0;
    text-align: center;
    padding: 2rem 0;
    text-transform: capitalize;
    font-weight: bold;
  }
`;

export default StyledContainer;
