import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

import {
  DynamicContextProvider,
  mergeNetworks
} from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";

const myEvmNetworks = [
  {
    blockExplorerUrls: ['https://testnet.airdao.io/'],
    chainId: 22040 ,
    chainName: 'AirDAO',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    name: 'AirDAO',
    nativeCurrency: {
      decimals: 18,
      name: 'AirDAO',
      symbol: 'AMB',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/eth.svg',
    },
    networkId: 22040 ,
    rpcUrls: [' https://network.ambrosus-test.io '],
  },
];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: "9e555bd1-826d-430f-8036-c153197ff5b1",
        walletConnectors: [
          EthereumWalletConnectors,
          FlowWalletConnectors,
          
        ],
        overrides: {
          evmNetworks: (networks) => mergeNetworks(myEvmNetworks, networks),
        }
      }}
    >
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
);

reportWebVitals();