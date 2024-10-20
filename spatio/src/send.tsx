import React, { FC, FormEventHandler, useState } from "react";

import { parseEther } from "viem";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

export const SendTransactionSection: FC = () => {
  const { primaryWallet } = useDynamicContext();

  const [txnHash, setTxnHash] = useState("");

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const address = formData.get("address") as string;
    const amount = formData.get("amount") as string;

    const walletClient = await primaryWallet.getWalletClient();

    const transaction = {
      to: address as `0x${string}`,
      value: amount ? parseEther(amount) : undefined,
    };

    try {
      const hash = await walletClient.sendTransaction(transaction);

      console.log(hash);
    } catch (error) {
      console.error("Transaction failed:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <p>Send to ETH address</p>
      <input name="address" type="text" required placeholder="Address" />
      <input name="amount" type="text" required placeholder="0.05" />
      <button type="submit">Send</button>
      <span data-testid="transaction-section-result-hash">{txnHash}</span>
    </form>
  );
};
