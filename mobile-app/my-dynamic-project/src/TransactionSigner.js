import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const TransactionSigner = ({ wallet }) => {
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Wallet object:", wallet); // Log the wallet object for debugging
  }, [wallet]);

  const requestTransaction = () => {
    const transaction = {
      to: "0x7e3bbf75aba09833f899bb1fdd917fc3a5617555", // Replace with actual recipient address
      value: ethers.parseEther("0.01"), // Replace with actual value
    };
    setPendingTransaction(transaction);
  };

  const signAndSendTransaction = async () => {
    if (!pendingTransaction) {
      setError("No pending transaction to sign");
      return;
    }

    try {
      console.log("Using wallet to sign transaction..."); // Debugging statement
      const provider = ethers.getDefaultProvider(); // Use a default provider
      const connectedWallet = wallet.connect(provider);
      const txResponse = await connectedWallet.sendTransaction(
        pendingTransaction
      );
      console.log("Transaction sent:", txResponse);
      setPendingTransaction(null);
    } catch (error) {
      console.error("Error signing or sending transaction:", error);
      setError(`Failed to sign or send transaction: ${error.message}`);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {pendingTransaction ? (
        <>
          <p>Pending Transaction:</p>
          <p>To: {pendingTransaction.to}</p>
          <p>Value: {ethers.formatEther(pendingTransaction.value)} ETH</p>
          <button onClick={signAndSendTransaction}>Sign and Send</button>
        </>
      ) : (
        <>
          <p>No pending transactions</p>
          <button onClick={requestTransaction}>Request Transaction</button>
        </>
      )}
    </div>
  );
};

export default TransactionSigner;
