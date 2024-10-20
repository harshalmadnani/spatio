import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { coins } from './coins';
import { Select, MenuItem, InputAdornment, createTheme, ThemeProvider, Alert, Snackbar, Typography, Paper, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';     
import { createContext, useContext } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePrivy } from "@privy-io/react-auth";
import { parseEther } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { Groq } from 'groq-sdk';


const DataContext = createContext<any>(null);

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  chatInterface: {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    fontFamily: "'SK Modernist', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    color: '#e5e5e5',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#1a1a1a',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  logo: {
    width: '5%',
    height: 'auto',
    marginRight: '2%',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  walletAddress: {
    fontSize: '14px',
    color: '#e5e5e5',
    cursor: 'pointer',
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    width: '400px',
  },
  walletAddressItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  popupInput: {
    flex: 1,
    marginRight: '10px',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#3a3a3a',
    color: '#e5e5e5',
    border: 'none',
    borderRadius: '5px',
  },
  addIcon: {
    cursor: 'pointer',
    color: '#4a90e2',
  },
  deleteIcon: {
    cursor: 'pointer',
    color: '#e74c3c',
  },
  popupButton: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  messageListContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  userAvatar: {
    backgroundColor: '#4a90e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  assistantAvatar: {
    backgroundColor: '#50e3c2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  bubble: {
    padding: '12px 16px',
    borderRadius: '20px',
    maxWidth: '70%',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  userBubble: {
    backgroundColor: '#4a4a4a',
    color: '#ffffff',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#333333',
    color: '#ffffff',
    alignSelf: 'flex-start',
  },
  inputForm: {
    display: 'flex',
    padding: '15px 20px',
    backgroundColor: 'transparent',
  },
  input: {
    flexGrow: 1,
    padding: '12px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '20px',
    marginRight: '10px',
    backgroundColor: '#3a3a3a',
    color: '#e5e5e5',
    outline: 'none',
  },
  sendButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: 'white',
    color: '#000',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
  },
  sendButtonDisabled: {
    backgroundColor: '#7fb3e0',
    cursor: 'not-allowed',
  },
  tokenCount: {
    fontSize: '12px',
    color: '#888',
    marginTop: '5px',
  },
  executionResult: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#2a2a2a',
    borderRadius: '5px',
  },
  executionResultHeader: {
    color: '#50e3c2',
    marginBottom: '5px',
  },
  rawDataContainer: {
    margin: '20px',
    padding: '10px',
    backgroundColor: '#2a2a2a',
    borderRadius: '5px',
  },
  rawDataPre: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  walletPortfolioContainer: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px 0',
    color: '#e5e5e5',
  },
  announcementBar: {
    backgroundColor: 'white',
    color: 'black',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'SK-Modernist-Regular, sans-serif',
    fontSize: '14px',
    position: 'relative',
  },
  announcementText: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    cursor: 'pointer',
    color: 'black',
    position: 'absolute',
    right: '10px',
  },
};

// Replace the OpenAI initialization with Groq
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY as string,
  dangerouslyAllowBrowser: true
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Define getTokenName as a global function
const getTokenName = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  const matchedCoin = coins.find(coin => 
    coin.name.toLowerCase() === lowercaseInput || 
    coin.symbol.toLowerCase() === lowercaseInput
  );
  return matchedCoin ? matchedCoin.name.toLowerCase() : input.toLowerCase();
};

function ChatInterface() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  console.log('*****user*****:', user);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddresses, setWalletAddresses] = useState<string[]>(['0x7e3bbf75aba09833f899bb1fdd917fc3a5617555']);
  const [newWalletAddress, setNewWalletAddress] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<any>(coins[0]);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCoins, setFilteredCoins] = useState<any[]>(coins);
  const [inputTokens, setInputTokens] = useState<number>(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true);
  const [newsData, setNewsData] = useState<Record<string, any>>({});
  // Create a data object to store all fetched data
  const [data, setData] = useState<{
    priceHistoryData: any;
    cryptoPanicNews: any;
    metadata: any;
    historicPortfolioData: any;
    walletPortfolio: any;
  }>({
    priceHistoryData: null,
    cryptoPanicNews: null,
    metadata: null,
    historicPortfolioData: null,
    walletPortfolio: null,
  });

  // Add a new state for error snackbar
  const [errorSnackbar, setErrorSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Add a new state for tracking API response time
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const messageListRef = useRef<HTMLDivElement>(null);

  const [marketData, setMarketData] = useState<Record<string, any>>({});
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [totalWalletBalance, setTotalWalletBalance] = useState<number>(0);
  const [totalRealizedPNL, setTotalRealizedPNL] = useState<number>(0);
  const [totalUnrealizedPNL, setTotalUnrealizedPNL] = useState<number>(0);
  const [assets, setAssets] = useState<any[]>([]);
  const [totalPNLHistory, setTotalPNLHistory] = useState<Record<string, any>>({});
  const [isWalletPortfolioLoading, setIsWalletPortfolioLoading] = useState<boolean>(true);
  const [historicPortfolioData, setHistoricPortfolioData] = useState<any>(null);
  const [priceHistoryData, setPriceHistoryData] = useState<Record<string, any>>({});

  const [isWalletDataLoading, setIsWalletDataLoading] = useState<boolean>(false);
  // console.log('*****idle liquidity*****:', idleLiquidity);
  // Add this constant after the existing state declarations
  const priceHistory = Object.entries(priceHistoryData).map(([coinName, data]: [string, any]) => ({
    coinName,
    data: data.map((item: any) => ({
      date: new Date(item[0]),
      price: item[1],
      volume: item[2],
      marketCap: item[3]
    }))
  }));
// ... existing code ...

const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum/period);
  }
  return sma;
};
const calculateRSI = (data, period = 14) => {
  const changes = data.slice(1).map((price, index) => price - data[index]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const rsi = [100 - (100 / (1 + avgGain / avgLoss))];

  for (let i = period; i < data.length - 1; i++) {
    const newAvgGain = (avgGain * (period - 1) + gains[i]) / period;
    const newAvgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rsi.push(100 - (100 / (1 + newAvgGain / newAvgLoss)));
    avgGain = newAvgGain;
    avgLoss = newAvgLoss;
  }

  return rsi;
};
const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  const shortEMA = calculateEMA(data, shortPeriod);
  const longEMA = calculateEMA(data, longPeriod);
  const macdLine = shortEMA.map((short, i) => short - longEMA[i]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

  return { macdLine, signalLine, histogram };
};

const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  const ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
};

const calculateBollingerBands = (data: number[], period = 20, multiplier = 2) => {
  const sma = calculateSMA(data, period);
  const upperBand: number[] = [];
  const lowerBand: number[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const std = Math.sqrt(slice.reduce((sum, x) => sum + Math.pow(x - sma[i - period + 1], 2), 0) / period);
    upperBand.push(sma[i - period + 1] + multiplier * std);
    lowerBand.push(sma[i - period + 1] - multiplier * std);
  }

  return { upperBand, middleBand: sma, lowerBand };
};

  const portfolioBalance = totalWalletBalance?.toFixed(2) ?? 'N/A';
  const portfolioRealizedPNL = totalRealizedPNL?.toFixed(2) ?? 'N/A';
  const portfolioUnrealizedPNL = totalUnrealizedPNL?.toFixed(2) ?? 'N/A';

  const portfolioAssetsList = assets?.map(asset => ({
    name: asset.asset?.name ?? 'Unknown',
    symbol: asset.asset?.symbol ?? 'N/A',
    balance: asset.token_balance?.toFixed(6) ?? 'N/A',
    value: asset.estimated_balance?.toFixed(2) ?? 'N/A'
  })) ?? [];

  const portfolioPNLTimelines = Object.entries(totalPNLHistory).reduce((acc: Record<string, { realized: string; unrealized: string }>, [key, value]: [string, any]) => {
    acc[key] = {
      realized: value.realized?.toFixed(2) ?? 'N/A',
      unrealized: value.unrealized?.toFixed(2) ?? 'N/A'
    };
    return acc;
  }, {});

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);



  useEffect(() => {
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchTerm]);

  // Modify the fetch functions to use try-catch and update error state
  const fetchPriceHistory = async (coinname: string, from: number | null = null, to: number | null = null) => {
    if (!coinname) {
      console.error('Attempted to fetch price history with undefined coinname');
      setErrorSnackbar({
        open: true,
        message: 'Cannot fetch price history: Coin name is undefined'
      });
      return null;
    }

    try {
      to = to || Date.now();
      from = from || to - 365 * 24 * 60 * 60 * 1000; // Default to 1 year if not provided

      console.log(`Fetching price history for ${coinname} from ${new Date(from)} to ${new Date(to)}...`);

      const response = await axios.get(`https://api.mobula.io/api/1/market/history`, {
        params: {
          asset: coinname,
          from: from,
          to: to,
        },
        headers: {
          Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });

      if (response.data && response.data.data && response.data.data.price_history) {
        console.log(`Price history for ${coinname} fetched successfully.`);
        return response.data.data.price_history;
      } else {
        console.error('Invalid price history data structure:', response.data);
        throw new Error('Invalid price history data structure');
      }
    } catch (error) {
      console.error(`Error fetching price history for ${coinname}:`, error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorSnackbar({ 
        open: true, 
        message: `Failed to fetch price history for ${coinname}: ${error.message}`
      });
      return null;
    }
  };

  const getPriceHistory = async (token: string) => {
    if (!priceHistoryData[token]) {
      const data = await fetchPriceHistory(token);
      if (data) {
        setPriceHistoryData(prevData => ({
          ...prevData,
          [token]: data
        }));
      }
      return data;
    }
    return priceHistoryData[token] || null;
  };

  const fetchCryptoPanicNews = async (coinname: string) => {
    try {
      if (!coinname) {
        console.error('Attempted to fetch CryptoPanic data with undefined coinname');
        setErrorSnackbar({
          open: true,
          message: 'Cannot fetch CryptoPanic data: Coin name is undefined'
        });
        return null;
      }

      const coin = coins.find(c => c.name.toLowerCase() === coinname.toLowerCase());
      if (!coin) {
        throw new Error(`Coin not found: ${coinname}`);
      }

      console.log(`Fetching CryptoPanic data for ${coinname} (${coin.symbol})...`);
      const response = await axios.get(`https://cryptopanic.com/api/free/v1/posts/`, {
        params: {
          auth_token: '2c962173d9c232ada498efac64234bfb8943ba70',
          public: 'true',
          currencies: coin.symbol
        }
      });

      if (response.data && response.data.results) {
        const newsItems = response.data.results.map(item => ({
          title: item.title,
          url: item.url
        }));
        console.log(`CryptoPanic data for ${coinname} updated successfully.`);
        return newsItems;
      } else {
        console.error('Invalid CryptoPanic data structure:', response.data);
        throw new Error('Invalid CryptoPanic data structure');
      }
    } catch (error) {
      console.error(`Error fetching CryptoPanic data for ${coinname}:`, error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorSnackbar({ 
        open: true, 
        message: `Failed to fetch CryptoPanic data for ${coinname}: ${error.message}`
      });
      return null;
    }
  };

  const getNews = async (token: string) => {
    if (!newsData[token]) {
      const data = await fetchCryptoPanicNews(token);
      if (data) {
        setNewsData(prevData => ({
          ...prevData,
          [token]: data
        }));
      }
      return data;
    }
    return newsData[token] || null;
  };

  const fetchMarketData = async (coinname: string) => {
    if (!coinname) {
      console.error('Attempted to fetch market data with undefined coinname');
      setErrorSnackbar({
        open: true,
        message: 'Cannot fetch market data: Coin name is undefined'
      });
      return null;
    }

    try {
      console.log(`Fetching market data for ${coinname}...`);
      const response = await axios.get(`https://api.mobula.io/api/1/market/data?asset=${coinname}`, {
        headers: {
          Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });
      
      console.log('Response received:', response);

      if (response.data && response.data.data) {
        console.log(`Market data for ${coinname} fetched successfully.`);
        return response.data.data;
      } else {
        console.error('Invalid market data structure:', response.data);
        throw new Error('Invalid market data structure');
      }
    } catch (error) {
      console.error(`Error fetching market data for ${coinname}:`, error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorSnackbar({ 
        open: true, 
        message: `Failed to fetch market data for ${coinname}: ${error.message}`
      });
      return null;
    }
  };

  // Function to get market data for a specific coin
  const getMarketData = async (token: string) => {
    if (!marketData[token]) {
      const data = await fetchMarketData(token);
      console.log('*****Market data*****:', data);
      if (data) {
        setMarketData(prevData => ({
          ...prevData,
          [token]: data
        }));
      console.log('*****Market data*****:', data);
      }
      return data;
    }
    console.log('*****Market data*****:', data);
    return marketData[token] || null;
  };

  const fetchMetadata = async (coinname: string) => {
    if (!coinname) {
      console.error('Attempted to fetch metadata with undefined coinname');
      setErrorSnackbar({
        open: true,
        message: 'Cannot fetch metadata: Coin name is undefined'
      });
      return null;
    }

    try {
      console.log(`Fetching metadata for ${coinname}...`);
      const response = await axios.get(`https://api.mobula.io/api/1/metadata?asset=${coinname}`, {
        headers: {
          Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });
      
      console.log('Metadata response received:', response);

      if (response.data && response.data.data) {
        console.log(`Metadata for ${coinname} fetched successfully.`);
        return response.data.data;
      } else {
        console.error('Invalid metadata structure:', response.data);
        throw new Error('Invalid metadata structure');
      }
    } catch (error) {
      console.error(`Error fetching metadata for ${coinname}:`, error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorSnackbar({ 
        open: true, 
        message: `Failed to fetch metadata for ${coinname}: ${error.message}`
      });
      return null;
    }
  };

  // Modify the getMetadata function
  const getMetadata = async (token: string) => {
    if (!metadata[token]) {
      const data = await fetchMetadata(token);
      if (data) {
        setMetadata(prevData => ({
          ...prevData,
          [token]: data
        }));
      }
      return data;
    }
    return metadata[token] || null;
  };

  const getWalletPortfolio = async (addresses = walletAddresses) => {
    if (!data.walletPortfolio) {
      const portfolioData = await fetchWalletPortfolio(addresses);
      if (portfolioData) {
        setData(prevData => ({
          ...prevData,
          walletPortfolio: portfolioData
        }));
      }
      return portfolioData;
    }
    return data.walletPortfolio || null;
  };

  const getHistoricPortfolio = async (from = null, to = null, addresses = walletAddresses) => {
    if (!data.historicPortfolioData) {
      const historicData = await fetchHistoricPortfolio(from, to, addresses);
      if (historicData) {
        setData(prevData => ({
          ...prevData,
          historicPortfolioData: historicData
        }));
      }
      return historicData;
    }
    return data.historicPortfolioData || null;
  };

  const fetchWalletPortfolio = async (addresses: string[]) => {
    try {
      const url = `https://api.mobula.io/api/1/wallet/multi-portfolio`;
      const params = new URLSearchParams({
        wallets: addresses.join(',')
      });

      console.log(`Fetching wallet portfolio from: ${url}?${params.toString()}`);

      const response = await axios.get(url, {
        params: params,
        headers: {
          Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });
      
      console.log('Wallet portfolio response:', response.data);
      
      if (response.data && response.data.data && response.data.data[0]) {
        const portfolioData = response.data.data[0];
        
        setTotalWalletBalance(portfolioData.total_wallet_balance);
        setWalletAddresses(portfolioData.wallets);
        setTotalRealizedPNL(portfolioData.total_realized_pnl);
        setTotalUnrealizedPNL(portfolioData.total_unrealized_pnl);
        setAssets(portfolioData.assets || []);
        setTotalPNLHistory(portfolioData.total_pnl_history || {});
        
        console.log('Assets:', portfolioData.assets);
        
        return response.data;
      } else {
        throw new Error('Invalid wallet portfolio data structure');
      }
    } catch (error) {
      console.error('Error fetching wallet portfolio:', error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorSnackbar({ open: true, message: `Failed to fetch wallet portfolio: ${error.message}` });
      return null;
    }
  };

  const fetchHistoricPortfolio = async (from: number | null = null, to: number | null = null, addresses: string[]) => {
    try {
      to = to || Date.now();
      from = from || to - 365 * 24 * 60 * 60 * 1000; // Default to 1 year if not provided

      const url = `https://api.mobula.io/api/1/wallet/history`;
      const params = new URLSearchParams({
        wallets: addresses.join(','),
        from: from.toString(),
        to: to.toString()
      });

      console.log(`Fetching historic portfolio data from: ${url}?${params.toString()}`);

      const response = await axios.get(url, {
        params: params,
        headers: {
          Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });

      if (response.data) {
        console.log('Historic portfolio data updated successfully.');
        return response.data;
      } else {
        throw new Error('Invalid historic portfolio data structure');
      }
    } catch (error) {
      console.error('Error fetching historic portfolio data:', error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorSnackbar({ 
        open: true, 
        message: `Failed to fetch historic portfolio data: ${error.message}`
      });
      return null;
    }
  };

  // Function to get data based on the key
  const getData = (key: string) => {
    return data[key];
  };

  const { primaryWallet } = useDynamicContext();

  // Add this function to send a transaction
  const sendTransaction = async (to: string, amount: string) => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      throw new Error("No Ethereum wallet connected");
    }

    const walletClient = await primaryWallet.getWalletClient();
    const transaction = {
      to: to as `0x${string}`,
      value: parseEther(amount),
    };

    try {
      const hash = await walletClient.sendTransaction(transaction);
      return hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  // Replace the callOpenAIAPI function with callGroqAPI
  const callGroqAPI = async (userInput: string) => {
    try {
      // Prepare the portfolio data
      const portfolioData = {
        balance: portfolioBalance,
        realizedPNL: portfolioRealizedPNL,
        unrealizedPNL: portfolioUnrealizedPNL,
        assetsList: assets.map(asset => ({
          name: asset.asset?.name || 'Unknown',
          symbol: asset.asset?.symbol || 'N/A',
          balance: asset.token_balance?.toFixed(6) || 'N/A',
          value: asset.estimated_balance?.toFixed(2) || 'N/A'
        })),
        pnlTimelines: Object.entries(totalPNLHistory).reduce((acc: Record<string, { realized: string; unrealized: string }>, [key, value]: [string, any]) => {
          acc[key] = {
            realized: value.realized?.toFixed(2) || 'N/A',
            unrealized: value.unrealized?.toFixed(2) || 'N/A'
          };
          return acc;
        }, {})
      };

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system",
            content: `You are spatio AI, a trading assistant with access to real-time financial data and wallet information. You can now also send transactions on behalf of the user. Before performing any operations, The coinName should be lowercase.

You have access to the following data where token is the coin name:

price(token)
volume(token)
marketCap(token)
marketCapDiluted(token)
liquidity(token)
liquidityChange24h(token)
offChainVolume(token)
volume7d(token)
volumeChange24h(token)
isListed(token)
priceChange24h(token)
priceChange1h(token)
priceChange7d(token)
priceChange1m(token)
priceChange1y(token)
ath(token)
atl(token)
rank(token)
totalSupply(token)
circulatingSupply(token)
website(token)
twitter(token)
telegram(token)
discord(token)
description(token)
priceHistoryData(token)
kyc(token)
audit(token)
totalSupplyContracts(token)
circulatingSupplyAddresses(token)
maxSupply(token)
chat(token)
tags(token)
distribution(token)
investors(token)
releaseSchedule(token)
getPriceHistory(token)
getNews(token)

You also have access to the following portfolio-related data:

portfolioData.balance: The total balance of the user's portfolio.
portfolioData.realizedPNL: The total realized Profit and Loss of the portfolio.
portfolioData.unrealizedPNL: The total unrealized Profit and Loss of the portfolio.

portfolioData.assetsList: An array of objects containing details about each asset in the portfolio. Each object has the following properties:
  - name: The name of the asset
  - symbol: The symbol of the asset
  - balance: The balance of the asset
  - value: The estimated value of the asset in USD

portfolioData.pnlTimelines: An object containing PNL data for different time periods. It has the following structure:
  - '24h': { realized: [value], unrealized: [value] }
  - '7d': { realized: [value], unrealized: [value] }
  - '30d': { realized: [value], unrealized: [value] }
  - '1y': { realized: [value], unrealized: [value] }

You also have access to the following function for sending transactions:

sendTransaction(to: string, amount: string): Sends a transaction to the specified address with the given amount of ETH. Returns a transaction hash if successful, or an error message if it fails.

To use this function in your responses, you should generate JavaScript code that calls this function as needed. Always ask for confirmation before sending any transaction, and provide clear information about the transaction details.

To use this data in your responses, you should generate JavaScript code that accesses and processes this data as needed. The code you generate will be executed by our system to provide the answer. Please format your response as follows:
1. Include the JavaScript code within a code block, starting with \`\`\`javascript and ending with \`\`\`.
2. The last line of your code should return the processed data.
3. Don't show any comments.
4. Always use optional chaining (?.) when accessing object properties.
5. Always return a value.
6. When sending a transaction, always ask for user confirmation before executing it.
7. When someone asks whether they shoud buy/sell/hold a token, or why is a token dumping or pumping, fetch all data possible`
          },
          { 
            role: "user", 
            content: userInput 
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 1,
        stream: false,
      });

      const inputTokenCount = chatCompletion.usage?.prompt_tokens;
      setInputTokens(inputTokenCount || 0);

      return chatCompletion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw new Error('Failed to get AI response');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');

    console.log('User input:', userInput);

    try {
      const initialGroqResponse = await callGroqAPI(userInput);
      console.log('Initial response from Groq:', initialGroqResponse);

      const processResponse = async (response: string, userInput: string): Promise<string> => {
        const codeMatch = response.match(/```javascript\n([\s\S]*?)\n```/);
        if (codeMatch && codeMatch[1]) {
          const code = codeMatch[1];
          const executionStartTime = Date.now();
          let result: any;
          const maxExecutionTime = 5000; // 5 seconds

          const executionPromise = new Promise<void>(async (resolve) => {
            result = await executeCode(codeMatch[1]);
            resolve();
          });


          await Promise.race([executionPromise]);

          const executionTime = Date.now() - executionStartTime;

          console.log('Execution result:', result);

          // Make a direct call to Groq API without the system prompt
          const finalResponse = await groq.chat.completions.create({
            messages: [
              { role: "user", content: `As spatio AI, provide an answer for the following query: "${userInput}". The data from the execution is: ${result}`  }
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 1,
            stream: false,
          });

          console.log('Final response from Groq:', finalResponse.choices[0]?.message?.content);

          return finalResponse.choices[0]?.message?.content || '';
        }
        return response;
      };

      const processedResponse = await processResponse(initialGroqResponse, userInput);
      setMessages(prev => [...prev, { role: 'assistant', content: processedResponse }]);

      const endTime = Date.now();
      setResponseTime(endTime - startTime);

    } catch (error: any) {
      setError(error.message);
      setErrorSnackbar({ open: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to execute the code generated by GPT
  const executeCode = async (code: string): Promise<any> => {
    try {
      const wrappedCode = code.includes('function') ? code : `async function executeAICode() {\n${code}\n}\nexecuteAICode();`;
      
      const func = new Function(
        'data', 'selectedCoin', 'setSelectedCoin', 'getMarketData', 'getMetadata', 'getPriceHistory',
        'price', 'volume', 'marketCap', 'website', 'twitter', 'telegram', 'discord', 'description',
        'portfolioData', 'getNews', 'historicPortfolioData', 'getTokenName',
        'liquidity', 'kyc', 'audit', 'totalSupplyContracts', 'totalSupply', 'circulatingSupply',
        'circulatingSupplyAddresses', 'maxSupply', 'chat', 'tags', 'distribution', 'investors', 'releaseSchedule',
        'calculateSMA', 'calculateRSI', 'calculateMACD', 'calculateBollingerBands', 'sendTransaction',
        `
          const { priceHistoryData, historicPortfolioData: historicData, walletPortfolio } = data;
          
          const isLoaded = (value) => value !== 'N/A' && value !== undefined && value !== null;

          const wrappedFunctions = {
            price: async (token) => {
              const result = await price(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            volume: async (token) => {
              const result = await volume(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            marketCap: async (token) => {
              const result = await marketCap(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            website: async (token) => {
              const result = await website(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            twitter: async (token) => {
              const result = await twitter(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            telegram: async (token) => {
              const result = await telegram(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            discord: async (token) => {
              const result = await discord(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            description: async (token) => {
              const result = await description(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            priceHistoryData: async (token) => priceHistoryData?.[getTokenName(token)] || 'please resend the prompt',
            getNews: async (token) => {
              const result = await getNews(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            liquidity: async (token) => {
              const result = await liquidity(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            kyc: async (token) => {
              const result = await kyc(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            audit: async (token) => {
              const result = await audit(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            totalSupplyContracts: async (token) => {
              const result = await totalSupplyContracts(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            totalSupply: async (token) => {
              const result = await totalSupply(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            circulatingSupply: async (token) => {
              const result = await circulatingSupply(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            circulatingSupplyAddresses: async (token) => {
              const result = await circulatingSupplyAddresses(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            maxSupply: async (token) => {
              const result = await maxSupply(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            chat: async (token) => {
              const result = await chat(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            tags: async (token) => {
              const result = await tags(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            distribution: async (token) => {
              const result = await distribution(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            investors: async (token) => {
              const result = await investors(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            releaseSchedule: async (token) => {
              const result = await releaseSchedule(getTokenName(token));
              return isLoaded(result) ? result : 'please resend the prompt';
            },
            getPriceHistory: async (token) => {
              const result = await getPriceHistory(getTokenName(token));
              if (isLoaded(result)) {
                const prices = result.map(item => item[1]);
                const sma20 = calculateSMA(prices, 20);
                const rsi14 = calculateRSI(prices, 14);
                const macd = calculateMACD(prices);
                const bollingerBands = calculateBollingerBands(prices);
                return {
                  priceHistory: result,
                  technicalIndicators: {
                    sma20: sma20,
                    rsi14: rsi14,
                    macd: macd,
                    bollingerBands: bollingerBands
                  }
                };
              } else {
                return 'please resend the prompt';
              }
            },
            sendTransaction: async (to, amount) => {
              try {
                const result = await sendTransaction(to, amount);
                return \`Transaction sent: \${result}\`;
              } catch (error) {
                return \`Error sending transaction: \${error.message}\`;
              }
            },
          };

          const finalCode = \`${wrappedCode}\`.replace(
            /(price|volume|marketCap|website|twitter|telegram|discord|description|priceHistoryData|getNews|liquidity|kyc|audit|totalSupplyContracts|totalSupply|circulatingSupply|circulatingSupplyAddresses|maxSupply|chat|tags|distribution|investors|releaseSchedule|getPriceHistory|sendTransaction)\\(/g,
            'await wrappedFunctions.$1('
          );

          return eval(finalCode);
        `
      );
      
      return await func(
        data, selectedCoin, setSelectedCoin, getMarketData, getMetadata, getPriceHistory,
        price, volume, marketCap, website, twitter, telegram, discord, description,
        {
          balance: portfolioBalance,
          realizedPNL: portfolioRealizedPNL,
          unrealizedPNL: portfolioUnrealizedPNL,
          assetsList: assets.map(asset => ({
            name: asset.asset?.name || 'Unknown',
            symbol: asset.asset?.symbol || 'N/A',
            balance: asset.token_balance?.toFixed(6) || 'N/A',
            value: asset.estimated_balance?.toFixed(2) || 'N/A'
          })),
          pnlTimelines: Object.entries(totalPNLHistory).reduce((acc, [key, value]) => {
            acc[key] = {
              realized: value.realized?.toFixed(2) || 'N/A',
              unrealized: value.unrealized?.toFixed(2) || 'N/A'
            };
            return acc;
          }, {})
        },
        getNews, historicPortfolioData, getTokenName,
        liquidity, kyc, audit, totalSupplyContracts, totalSupply, circulatingSupply,
        circulatingSupplyAddresses, maxSupply, chat, tags, distribution, investors, releaseSchedule,
        calculateSMA, calculateRSI, calculateMACD, calculateBollingerBands,
        sendTransaction
      );
    } catch (error) {
      console.error('Error executing code:', error);
      return `Error: ${error.message}. Please try rephrasing your question.`;
    }   
  };

  // Modify the renderMessage function to include response time
  const renderMessage = (message: { role: string; content: string }, index: number) => {
    let content = message.content;
    
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/###\s*(.*?)\s*(\n|$)/g, '<h3>$1</h3>');
    
    // Parse the execution result
    const executionResultMatch = content.match(/\*\*Execution Result:\*\*\n```\n([\s\S]*?)\n```/);
    const executionResult = executionResultMatch ? executionResultMatch[1] : null;
    
    // Check if the execution result is "please resend the prompt"
    if (executionResult === 'please resend the prompt') {
      content = 'Please resend the prompt.';
    } else if (executionResult && executionResult.startsWith('"') && executionResult.endsWith('"')) {
      // Remove quotes from the execution result if it's a simple string
      content = content.replace(executionResult, executionResult.slice(1, -1));
    }
    
    return (
      <div key={index} style={styles.message}>
        <div style={{
          ...styles.avatar,
          ...(message.role === 'user' ? styles.userAvatar : styles.assistantAvatar)
        }}>
          {message.role === 'user' ? 'U' : 'A'}
        </div>
        <div style={{
          ...styles.bubble,
          ...(message.role === 'user' ? styles.userBubble : styles.assistantBubble)
        }}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {message.role === 'user' && index === messages.length - 2 && (
            <div style={styles.tokenCount}>Input Tokens: {inputTokens}</div>
          )}
          {message.role === 'assistant' && index === messages.length - 1 && responseTime && (
            <Typography variant="caption" style={{ marginTop: '5px', color: '#888' }}>
              Response time: {responseTime}ms
            </Typography>
          )}
        </div>
      </div>
    );
  };

  const handleWalletAddressClick = () => {
    setShowPopup(true);
    setNewWalletAddress('');
  };

  const handleRemoveWalletAddress = async (index: number) => {
    const updatedAddresses = walletAddresses.filter((_, i) => i !== index);
    await updateWalletAddresses(updatedAddresses);
  };

  const handleAddWalletAddress = async () => {
    if (newWalletAddress) {
      const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(newWalletAddress);
      const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(newWalletAddress);
      
      if (!isEthereumAddress && !isSolanaAddress) {
        setErrorSnackbar({ open: true, message: 'Invalid wallet address. Please enter a valid Ethereum or Solana address.' });
        return;
      }

      const updatedAddresses = [...walletAddresses, newWalletAddress];
      await updateWalletAddresses(updatedAddresses);
      setNewWalletAddress('');
    }
  };

  const updateWalletAddresses = async (updatedAddresses: string[]) => {
    setIsWalletDataLoading(true);

    try {
      setWalletAddresses(updatedAddresses);
      console.log('Updated wallet addresses:', updatedAddresses);

      const [historicData, walletData] = await Promise.all([
        getHistoricPortfolio(null, null, updatedAddresses),
        getWalletPortfolio(updatedAddresses)
      ]);

      // Wait for a short delay to ensure data is properly set
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log the fetched data for debugging
      console.log('Fetched historic data:', historicData);
      console.log('Fetched wallet data:', walletData);

      // Check if data is loaded
      if (!historicData || !walletData) {
        throw new Error('Failed to load wallet data: One or both data fetches returned null or undefined');
      }

      setErrorSnackbar({ open: true, message: 'Wallet data updated successfully' });
    } catch (error) {
      console.error('Error updating wallet data:', error);
      setErrorSnackbar({ open: true, message: `Failed to update wallet data: ${error.message}` });
      // Revert wallet addresses if there was an error
      setWalletAddresses(prevAddresses => prevAddresses);
    } finally {
      setIsWalletDataLoading(false);
    }
  };

  // Add this new function to handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Add a function to handle closing the error snackbar
  const handleCloseErrorSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackbar({ ...errorSnackbar, open: false });
  };

  // Modify these functions to return Promises
  const website = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Website*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.website || 'N/A';
  };
  const twitter = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Twitter*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.twitter || 'N/A';
  };
  const telegram = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Telegram*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.telegram || 'N/A';
  };
  const discord = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Discord*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.discord || 'N/A';
  };
  const description = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Description*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.description || 'N/A';
  };
  const price = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Price*****:', data);
    if (!data) return 'please resend the prompt';
    return data.price !== undefined ? `$${data.price.toFixed(2)}` : 'N/A';
  };
  const volume = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Volume*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.volume !== undefined ? `$${metadata.volume.toFixed(2)}` : 'N/A';
  };
  const marketCap = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Market Cap*****:', data);
    if (!data) return 'please resend the prompt';
    return data.market_cap !== undefined ? `$${data.market_cap.toFixed(2)}` : 'N/A';
  };
  const marketCapDiluted = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Market Cap Diluted*****:', data);
    if (!data) return 'please resend the prompt';
    return data.market_cap_diluted !== undefined ? `$${data.market_cap_diluted.toFixed(2)}` : 'N/A';
  };
  const liquidity = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Liquidity*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.liquidity !== undefined ? `$${metadata.liquidity.toFixed(2)}` : 'N/A';
  };
  const liquidityChange24h = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Liquidity Change 24h*****:', data);
    if (!data) return 'please resend the prompt';
    return data.liquidity_change_24h !== undefined ? `${data.liquidity_change_24h.toFixed(2)}%` : 'N/A';
  };
  const offChainVolume = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Off Chain Volume*****:', data);
    if (!data) return 'please resend the prompt';
    return data.off_chain_volume !== undefined ? `$${data.off_chain_volume.toFixed(2)}` : 'N/A';
  };
  const volume7d = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Volume 7d*****:', data);
    if (!data) return 'please resend the prompt';
    return data.volume_7d !== undefined ? `$${data.volume_7d.toFixed(2)}` : 'N/A';
  };
  const volumeChange24h = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Volume Change 24h*****:', data);
    if (!data) return 'please resend the prompt';
    return data.volume_change_24h !== undefined ? `${data.volume_change_24h.toFixed(2)}%` : 'N/A';
  };
  const isListed = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Is Listed*****:', data);
    if (!data) return 'please resend the prompt';
    return data.is_listed !== undefined ? (data.is_listed ? 'Yes' : 'No') : 'N/A';
  };
  const priceChange24h = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Price Change 24h*****:', data);
    if (!data) return 'please resend the prompt';
    return data.price_change_24h !== undefined ? `${data.price_change_24h.toFixed(2)}%` : 'N/A';
  };
  const priceChange1h = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Price Change 1h*****:', data);
    if (!data) return 'please resend the prompt';
    return data.price_change_1h !== undefined ? `${data.price_change_1h.toFixed(2)}%` : 'N/A';
  };
  const priceChange7d = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Price Change 7d*****:', data);
    if (!data) return 'please resend the prompt';
    return data.price_change_7d !== undefined ? `${data.price_change_7d.toFixed(2)}%` : 'N/A';
  };
  const priceChange1m = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Price Change 1m*****:', data);
    if (!data) return 'please resend the prompt';
    return data.price_change_1m !== undefined ? `${data.price_change_1m.toFixed(2)}%` : 'N/A';
  };
  const priceChange1y = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Price Change 1y*****:', data);
    if (!data) return 'please resend the prompt';
    return data.price_change_1y !== undefined ? `${data.price_change_1y.toFixed(2)}%` : 'N/A';
  };

  const ath = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****ATH*****:', data);
    if (!data) return 'please resend the prompt';
    return data.ath !== undefined ? `$${data.ath.toFixed(2)}` : 'N/A';
  };
  const atl = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****ATL*****:', data);
    if (!data) return 'please resend the prompt';
    return data.atl !== undefined ? `$${data.atl.toFixed(2)}` : 'N/A';
  };
  const rank = async (token: string) => {
    const data = await getMarketData(token);
    console.log('*****Rank*****:', data);
    if (!data) return 'please resend the prompt';
    return data.rank !== undefined ? data.rank : 'N/A';
  };
  const totalSupply = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Total Supply*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.total_supply !== undefined ? metadata.total_supply.toFixed(0) : 'N/A';
  };
  const circulatingSupply = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Circulating Supply*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.circulating_supply !== undefined ? metadata.circulating_supply.toFixed(0) : 'N/A';
  };
  const kyc = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****KYC*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.kyc || 'N/A';
  };
  const audit = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Audit*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.audit || 'N/A';
  };
  const totalSupplyContracts = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Total Supply Contracts*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.total_supply_contracts?.join(', ') || 'N/A';
  };
  const circulatingSupplyAddresses = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Circulating Supply Addresses*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.circulating_supply_addresses?.join(', ') || 'N/A';
  };
  const maxSupply = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Max Supply*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.max_supply !== undefined ? metadata.max_supply.toFixed(0) : 'N/A';
  };
  const chat = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Chat*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.chat || 'N/A';
  };
  const tags = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Tags*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.tags?.join(', ') || 'N/A';
  };
  const distribution = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Distribution*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.distribution?.map(d => `${d.name}: ${d.percentage}%`).join(', ') || 'N/A';
  };
  const investors = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Investors*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.investors?.map(i => i.name).join(', ') || 'N/A';
  };
  const releaseSchedule = async (token: string) => {
    const metadata = await getMetadata(token);
    console.log('*****Release Schedule*****:', metadata);
    if (!metadata) return 'please resend the prompt';
    return metadata.release_schedule?.join(', ') || 'N/A';
  };

  const handleAcceptDisclaimer = () => {
    setDisclaimerAccepted(true);
  };

  // Render the disclaimer dialog
  const renderDisclaimerDialog = () => (
    <Dialog
      open={!disclaimerAccepted}
      aria-labelledby="disclaimer-dialog-title"
      aria-describedby="disclaimer-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: 'white',
          color: 'black',
          fontFamily: "'SK Modernist', sans-serif",
        },
      }}
    >
      <DialogTitle id="disclaimer-dialog-title" style={{ 
        textAlign: 'center', 
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        {"DISCLAIMER"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="disclaimer-dialog-description" style={{ 
          fontSize: '20px', 
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
        }}>
          NOT FINANCIAL ADVICE
        </DialogContentText>
        <DialogContentText style={{ 
          marginTop: '20px',
          color: 'black',
        }}>
          The information provided by this application is for informational purposes only and should not be considered as financial advice. Always conduct your own research and consult with a qualified financial advisor before making any investment decisions.
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center', padding: '20px' }}>
        <Button 
          onClick={handleAcceptDisclaimer} 
          variant="contained" 
          style={{ 
            backgroundColor: 'black',
            color: 'white',
            width: '200px',
          }}
        >
          Accept and Continue
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
  };

  const handleSendPOL = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      setErrorSnackbar({
        open: true,
        message: "No Ethereum wallet connected"
      });
      return;
    }

    const walletClient = await primaryWallet.getWalletClient();
    const [address] = await walletClient.getAddresses();

    try {
      // Always send 0.001 POL, regardless of any token mentioned by the user
      const result = await sendTransaction(address, "0.001");
      setErrorSnackbar({
        open: true,
        message: `Transaction sent: ${result}`
      });
    } catch (error) {
      setErrorSnackbar({
        open: true,
        message: `Error sending transaction: ${error.message}`
      });
    }
  };

  return (
    <div style={styles.chatInterface}>
      {renderDisclaimerDialog()}
      {showAnnouncement && (
        <div style={styles.announcementBar}>
          <span style={styles.announcementText}>spatio AI can only answer questions related to your portfolio right now!</span>
          <CloseIcon style={styles.closeButton} onClick={handleCloseAnnouncement} />
        </div>
      )}
      <div style={{
        ...styles.header,
        justifyContent: 'space-between',
      }}>
        <img src={require('./SPATIO.png')} alt="spatio AI Logo" style={styles.logo} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={styles.walletAddress} onClick={handleWalletAddressClick}>
            {walletAddresses.length > 0
              ? `${walletAddresses[0].slice(0, 6)}...${walletAddresses[0].slice(-4)}`
              : 'Add Wallet'}
            {walletAddresses.length > 1 && ` (+${walletAddresses.length - 1})`}
          </div>
         
        </div>
      </div>
      <div style={styles.messageListContainer}>
        <div style={styles.messageList} ref={messageListRef}>
          {messages.map((message, index) => renderMessage(message, index))}
        </div>

      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          style={{...styles.sendButton, ...(isLoading ? styles.sendButtonDisabled : {})}}
        >
          {isLoading ? 'Analyzing...' : 'Send'}
        </button>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      {showPopup && (
        <div style={styles.popup}>
          {walletAddresses.map((address, index) => (
            <div key={index} style={styles.walletAddressItem}>
              <input
                type="text"
                value={address}
                readOnly
                style={styles.popupInput}
              />
              <DeleteIcon
                onClick={() => handleRemoveWalletAddress(index)}
                style={styles.deleteIcon}
              />
            </div>
          ))}
          <div style={styles.walletAddressItem}>
            <input
              type="text"
              value={newWalletAddress}
              onChange={(e) => setNewWalletAddress(e.target.value)}
              placeholder="Enter new wallet address"
              style={styles.popupInput}
            />
            <AddIcon
              onClick={handleAddWalletAddress}
              style={styles.addIcon}
            />
          </div>
          <button 
            onClick={() => setShowPopup(false)} 
            style={styles.popupButton}
            disabled={isWalletDataLoading}
          >
            Close
          </button>
        </div>
      )}
      <Snackbar open={errorSnackbar.open} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ChatInterface;