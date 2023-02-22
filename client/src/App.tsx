import { Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { GlobalStyles, StyledContainer } from "./styles";
import { ThemeProvider } from "styled-components";
import { Home } from "./pages";
import { connect } from "socket.io-client";
import theme from "./styles/theme";

export const SocketIoContext = createContext(null);

function App() {
  const [io, setIo] = useState<any>(null);
  const [room, setRoom] = useState("");

  // establish connection to the server
  useEffect(() => {
    setIo(
      connect(
        process.env.NODE_ENV === "production" ? "" : "http://localhost:8000"
      )
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SocketIoContext.Provider value={io}>
        <GlobalStyles />
        <StyledContainer>
          <div className="inner">
            <h1>tic tac toe</h1>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </StyledContainer>
      </SocketIoContext.Provider>
    </ThemeProvider>
  );
}

export default App;
