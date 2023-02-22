import { useEffect, useState } from "react";
import { GlobalStyles, StyledContainer } from "./styles";
import { connect } from "socket.io-client";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [io, setIo] = useState<any>(null);

  useEffect(() => {
    setIo(connect("http://localhost:8000"));
  }, []);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    const input = e.target.input;
    setMessages([...messages, input.value]);
  };

  return (
    <div>
      <GlobalStyles />
      <StyledContainer>
        <div className="messages">
          {messages.map((message, index) => (
            <p
              key={index}
              style={{
                background: index % 2 ? "darkgrey" : "transparent",
                color: index % 2 ? "black" : "inherit",
              }}
            >
              {message}
            </p>
          ))}
        </div>
        <form onSubmit={handleOnSubmit}>
          <input type="text" name="input" placeholder="Write message" />
          <button>🚀</button>
        </form>
      </StyledContainer>
    </div>
  );
}

export default App;
