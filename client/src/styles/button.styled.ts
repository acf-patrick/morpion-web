import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.buttonBackground};
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: 1rem;
  font-weight: bold;
  text-transform: capitalize;
  cursor: pointer;
  padding: 0.75rem 1.25rem;
  border-radius: 5px;
  border: none;
  outline: none;
  transition: all 300ms linear;

  &:hover {
    transform: translateY(-3px);
  }

  &:focus {
    outline: 3px solid blue;
  }
`;

export default StyledButton;
