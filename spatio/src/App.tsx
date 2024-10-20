import "./App.css";
import React from 'react';
import ChatInterface from "./ai.tsx";
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