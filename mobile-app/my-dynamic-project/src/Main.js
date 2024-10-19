import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import DynamicMethods from "./Methods.js";
import ChatInterface from "./ai.js";
import "./Main.css";

const checkIsDarkSchemePreferred = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false;

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkSchemePreferred);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useDynamicContext();

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleChange = () => setIsDarkMode(checkIsDarkSchemePreferred());

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Function to handle login status change
  const handleLoginStatusChange = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <>
      <div className={`container ${isDarkMode ? "dark" : "light"}`}>
        <div className="content-wrapper">
          <div className="modal auth-section">
            <DynamicWidget
              onAuthSuccess={() => setIsLoggedIn(true)}
              onLogout={() => setIsLoggedIn(false)}
            />
            {/*<DynamicMethods
              isDarkMode={isDarkMode}
              onLoginStatusChange={handleLoginStatusChange}
            />*/}
          </div>
          {isLoggedIn && (
            <div className="chat-interface-wrapper reduced-width">
              <ChatInterface />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
