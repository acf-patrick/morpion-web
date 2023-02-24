import { useEffect, useState } from "react";
import { GlobalStyles, StyledContainer } from "./styles";
import { ThemeProvider } from "styled-components";
import { Grid } from "./components";
import { connect } from "socket.io-client";
import { StyledButton } from "./styles";
import theme from "./styles/theme";

function App() {
  // Socket.io connection handler
  const [io, setIo] = useState<any>(null);

  // Game room
  const [room, setRoom] = useState("");

  useEffect(() => {
    // Check for existing room
    const value = sessionStorage.getItem("room");
    if (value) setRoom(value);

    // establish connection to the server
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

  const handleCellOnClick = (cellIndex: number) => {
    if (!room) return;
    const [i, j] = [Math.floor(cellIndex / 3), cellIndex % 3];

    setGrid([...grid]);
  };

  const newGame = (newRoom: string) => {
    let joined = true;
    io.emit("new game", newRoom).on("room full", () => {
      alert("Seems that you'll have to join another game. 😕");
      joined = false;
    });

    if (joined) {
      setRoom(newRoom);
      sessionStorage.setItem("room", newRoom);
    }
  };

  const quitGame = () => {
    if (confirm("Are you sure ?")) {
      io.emit("quit game");
      sessionStorage.removeItem("room");
      setRoom("");
      setGrid([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledContainer>
        <div className="inner">
          <h1>tic tac toe</h1>
          <Grid cells={grid} handleCellOnClick={handleCellOnClick} />
          {room ? (
            <div className="quit">
              <StyledButton onClick={quitGame}>quit game</StyledButton>
            </div>
          ) : (
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                newGame(e.target.room.value);
              }}
            >
              <input
                type="text"
                placeholder="Enter room name to join"
                name="room"
                required
              />
              <StyledButton type="submit">new game</StyledButton>
            </form>
          )}
        </div>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
