import WebSocket, { WebSocketServer } from 'ws';
import { startBackgroundJobs } from './bgjob';

const PORT = 8080;

const symbols = [
  'btcusdt',
  'ethusdt',
  'solusdt',
  'bnbusdt',
  'xrpusdt',
  'adausdt',
  'dogeusdt',
  'avaxusdt',
  'linkusdt',
  'maticusdt',
];

const streamUrl = `wss://stream.binance.com:9443/stream?streams=${symbols
  .map((s) => `${s}@ticker`)
  .join('/')}`;

const wss = new WebSocketServer({ port: PORT });

const latestPrices: Record<
  string,
  {
    symbol: string;
    price: string;
    change: string;
    percentChange: string;
  }
> = {};

wss.on('connection', (client: WebSocket) => {
  console.log('Frontend connected ✅');

  const binanceSocket = new WebSocket(streamUrl);

  binanceSocket.on('message', (data: WebSocket.RawData) => {
    try {
      const parsed = JSON.parse(data.toString());
      const ticker = parsed.data;

      const clean = {
        symbol: ticker.s,
        price: ticker.c,
        change: ticker.p,
        percentChange: ticker.P,
      };

      latestPrices[ticker.s] = clean;

      // Send updated list to frontend
      client.send(JSON.stringify(Object.values(latestPrices)));
    } catch (err) {
      console.error('Error parsing Binance data:', err);
    }
  });

  client.on('close', () => {
    console.log('Frontend disconnected ❌');
    binanceSocket.close();
  });

  binanceSocket.on('close', () => {
    console.log('Binance WebSocket closed ❌');
  });

  binanceSocket.on('error', (err) => {
    console.error('Binance WebSocket error:', err.message);
  });
});

console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
startBackgroundJobs();
