import styled, { keyframes } from "styled-components";

const expand = keyframes`
  from {
    transform: scaleX(0);
  } to {
    transform: scaleX(1);
  }
`;

const StyledContainer = styled.div`
  height: 100vh;
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
    display: flex;
    flex-direction: column;
    margin-top: 0;
    text-align: center;
    padding: 2rem 0;
    text-transform: capitalize;
    font-weight: bold;
    position: relavite;

    &:after {
      display: block;
      content: "";
      width: 25%;
      height: 2px;
      margin: 0 auto;
      background-color: white;
      bottom: 0;
      animation: ${expand} 1s 500ms both;
    }
  }
`;

export default StyledContainer;
