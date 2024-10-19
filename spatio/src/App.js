import "./App.css";
import ChatInterface from "./ai.js";
import { usePrivy } from "@privy-io/react-auth";
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
