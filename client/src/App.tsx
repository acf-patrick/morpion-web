import { Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { GlobalStyles, StyledContainer } from "./styles";
import { ThemeProvider } from "styled-components";
import { Grid } from "./components";
import { connect } from "socket.io-client";
import { StyledButton } from "./styles";
import theme from "./styles/theme";

export const SocketIoContext = createContext(null);

function App() {
  // Socket.io connection handler
  const [io, setIo] = useState<any>(null);

  // establish connection to the server
  useEffect(() => {
    setIo(
      connect(
        process.env.NODE_ENV === "production" ? "" : "http://localhost:8000"
      )
    );
  }, []);

  // Main game grid
  const [grid, setGrid] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // Game room
  const [room, setRoom] = useState("");

  const handleCellOnClick = (cellIndex: number) => {
    const [i, j] = [Math.floor(cellIndex / 3), cellIndex % 3];
    grid[i][j] = "x";
    setGrid([...grid]);
  };

  const newGame = (e: any) => {
    e.preventDefault();
    const input = e.target.room;
    setRoom(input.value);
    sessionStorage.setItem("room", room);
  };

  return (
    <ThemeProvider theme={theme}>
      <SocketIoContext.Provider value={io}>
        <GlobalStyles />
        <StyledContainer>
          <div className="inner">
            <h1>tic tac toe</h1>
            <Grid cells={grid} handleCellOnClick={handleCellOnClick} />
            <form onSubmit={newGame}>
              <input type="text" placeholder="Enter room name to join" name="room" />
              {room ? <></> : <StyledButton type="submit">new game</StyledButton>}
            </form>
          </div>
        </StyledContainer>
      </SocketIoContext.Provider>
    </ThemeProvider>
  );
}

export default App;
