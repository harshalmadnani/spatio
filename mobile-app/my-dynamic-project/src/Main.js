import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import ChatInterface from "./ai.js";
import TransactionSigner from "./TransactionSigner.js";
import "./Main.css";

const checkIsDarkSchemePreferred = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false;

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkSchemePreferred);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, wallet } = useDynamicContext();

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleChange = () => setIsDarkMode(checkIsDarkSchemePreferred());

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    } else {
      console.log("User is not logged in.");
    }
    if (wallet) {
      console.log("Wallet is available:", wallet);
    } else {
      console.log("Wallet is not available.");
    }
  }, [user, wallet]);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  return (
    <>
      <div className={`container ${isDarkMode ? "dark" : "light"}`}>
        <div className="content-wrapper">
          {!isLoggedIn && (
            <div className="modal auth-section">
              <DynamicWidget
                onAuthSuccess={() => setIsLoggedIn(true)}
                onLogout={() => setIsLoggedIn(false)}
              />
            </div>
          )}
          {isLoggedIn && wallet && (
            <div className="chat-interface-wrapper reduced-width">
              <ChatInterface />
              <TransactionSigner wallet={wallet} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
