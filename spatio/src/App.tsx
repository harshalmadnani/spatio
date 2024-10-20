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
      {!isLoggedIn && (
        <>
          <video autoPlay loop muted className="background-video">
            <source src={require('./1.mp4')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
              <img 
                src={require('./SPATIO.png')} 
                alt="spatio AI Logo" 
                style={{ width: '200px', height: 'auto' }}
              />
              <p style={{
                fontFamily: 'monospace',
                marginTop: '10%',
                marginBottom: '20%',
                textAlign: 'center',
              }}>
                Your personal crypto trading and research assistant
              </p>
            
         
        </>
      )}
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
