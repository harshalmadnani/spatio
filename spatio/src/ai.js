import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import OpenAI from "openai";
import { coins } from './coins.js';


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});


function ChatInterface() {
}

export default ChatInterface;