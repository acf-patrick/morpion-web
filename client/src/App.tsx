import { useEffect, useMemo, useState } from "react";
import { GlobalStyles, StyledContainer } from "./styles";
import { ThemeProvider } from "styled-components";
import { Grid } from "./components";
import { Socket, connect } from "socket.io-client";
import { StyledButton } from "./styles";
import theme from "./styles/theme";
import { getWinner, isFull } from "./utils";

function App() {
  // Socket.io connection handler
  const [io, setIo] = useState<Socket | null>(null);

  // Game room
  const [room, setRoom] = useState("");

  // Main game grid
  const [grid, setGrid] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // Result of the game
  const result = useMemo(() => {
    const result = {
      finished: false,
      winner: "",
    };

    const winner = getWinner(grid);
    if (winner) {
      result.finished = true;
      result.winner = winner;
    } else if (isFull(grid)) result.finished = true;

    return result;
  }, [grid]);

  useEffect(() => {
    // Check for existing room
    const value = sessionStorage.getItem("room");
    if (value) setRoom(value);

    // establish connection to the server
    setIo(
      connect(
        process.env.NODE_ENV === "production"
          ? "https://morpion-epc0.onrender.com"
          : "http://localhost:8000"
      )
    );
  }, []);

  useEffect(() => {
    io?.on(
      "join response",
      (response: { room: string; success: boolean; grid?: string[][] }) => {
        if (response.success) {
          if (response.grid) setGrid(response.grid);
          setRoom(response.room);
          sessionStorage.setItem("room", response.room);
        } else {
          alert("Seems that you'll have to join another game. 😕");
        }
      }
    );

    io?.on("grid update", (grid: string[][]) => {
      if (room) setGrid(grid);
    });

    return () => {
      io?.off("join response");
      io?.off("grid update");
      io?.off("game end");
    };
  }, [io, room]);

  const handleCellOnClick = (cellIndex: number) => {
    if (room) {
      const [i, j] = [Math.floor(cellIndex / 3), cellIndex % 3];
      io?.emit("place pawn", [i, j]);
    }
  };

  const newGame = (room: string) => {
    io?.emit("join game", room);
  };

  const quit = () => {
    io?.emit("quit game");
    sessionStorage.removeItem("room");
    setRoom("");
    setGrid([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  };

  const quitGame = () => {
    if (confirm("Are you sure ?")) quit();
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledContainer>
        <div className="inner">
          <h1>tic tac toe</h1>
          <Grid cells={grid} handleCellOnClick={handleCellOnClick} />
          {result.finished && (
            <p>
              {result.winner
                ? `${result.winner.toUpperCase()} wins the game! 🎉`
                : `Seems like we have a draw 🤔`}
            </p>
          )}
          {room ? (
            <div className="buttons">
              <StyledButton onClick={quitGame}>quit game</StyledButton>
              {result.finished && (
                <StyledButton
                  onClick={() => {
                    io?.emit("rematch");
                  }}
                >
                  rematch
                </StyledButton>
              )}
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
                placeholder="Enter 'solo' to play solo"
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
