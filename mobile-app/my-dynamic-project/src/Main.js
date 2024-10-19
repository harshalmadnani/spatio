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
        <div className="header">
          <img
            className="logo"
            src={isDarkMode ? "/logo-light.png" : "/logo-dark.png"}
            alt="dynamic"
          />
          <div className="header-buttons">
            <button
              className="docs-button"
              onClick={() =>
                window.open(
                  "https://docs.dynamic.xyz",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Docs
            </button>
            <button
              className="get-started"
              onClick={() =>
                window.open(
                  "https://app.dynamic.xyz",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Get started
            </button>
          </div>
        </div>
        <div className="modal">
          <DynamicWidget
            onAuthSuccess={() => setIsLoggedIn(true)}
            onLogout={() => setIsLoggedIn(false)}
          />
          {/* <DynamicMethods
            isDarkMode={isDarkMode}
            onLoginStatusChange={handleLoginStatusChange}
          /> */}
          {isLoggedIn && <ChatInterface />}
        </div>
        <div className="footer">
          <div className="footer-text">Made with ❤️ by dynamic</div>
          <img
            className="footer-image"
            src={isDarkMode ? "/image-dark.png" : "/image-light.png"}
            alt="dynamic"
          />
        </div>
      </div>
    </>
  );
};

export default Main;
