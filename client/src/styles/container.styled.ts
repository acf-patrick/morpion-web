import styled from "styled-components";

const StyledContainer = styled.div`
  width: 480px;
  height: 640px;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  gap: 1rem;

  .messages {
    flex-grow: 1;
    border: 1px solid white;

    p {
      padding: 0.25rem;
      overflow-wrap: break-word;
    }
  }

  form {
    display: flex;
    gap: 0.5rem;

    input {
      flex-grow: 1;
      padding: 0.5rem;
    }
  }
`;

export default StyledContainer;