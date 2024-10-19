import "./App.css";
import { usePrivy } from "@privy-io/react-auth";
import ChatInterface from "./ai.js";

function App() {

  const { ready, authenticated, user, login, logout } = usePrivy();
  if (!ready) {
    return null;
  }

  return (
    <div className="App">
      <header className="App-header">
      {ready && authenticated ? (
          <ChatInterface />
        ) : (
          <button onClick={login} style={{padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>Log In</button>
        )}
      </header>
    </div>
  );
}

export default App;
