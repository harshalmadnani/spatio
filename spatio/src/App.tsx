import "./App.css";
import React from 'react';
import ChatInterface from "./ai.tsx";
import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { SendTransactionSection } from "./send.tsx";

function App() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="App">
      <header className="App-header">
        <DynamicWidget />

        {}
        {isLoggedIn && (
          <>
            <ChatInterface />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
