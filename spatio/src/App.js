import "./App.css";
import ChatInterface from "./ai.js";
import { usePrivy } from "@privy-io/react-auth";
function App() {


  return (
    <div className="App">
      <header className="App-header">

        <ChatInterface />
     
      </header>
    </div>
  );
}

export default App;
