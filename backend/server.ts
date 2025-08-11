import WebSocket, { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8080;

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

const wss = new WebSocketServer({ port: Number(PORT) });

const latestPrices: Record<
  string,
  { symbol: string; price: string; change: string; percentChange: string }
> = {};

// ✅ One Binance WebSocket for all clients
const binanceSocket = new WebSocket(streamUrl);

binanceSocket.on('open', () => {
  console.log('Connected to Binance stream ✅');
});

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

    // Broadcast to all connected clients
    const payload = JSON.stringify(Object.values(latestPrices));
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  } catch (err) {
    console.error('Error parsing Binance data:', err);
  }
});

binanceSocket.on('close', () => {
  console.log('Binance WebSocket closed ❌');
});

binanceSocket.on('error', (err) => {
  console.error('Binance WebSocket error:', err.message);
});

// Handle frontend connections
wss.on('connection', () => {
  console.log('Frontend connected ✅');
});

console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);

// 🔹 Fetch price for a single symbol once
export function fetchPrice(symbol: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
    const ws = new WebSocket(url);

    ws.on('open', () => {
      console.log(`Connected to Binance for ${symbol.toUpperCase()} ✅`);
    });

    ws.on('message', (data: WebSocket.RawData) => {
      try {
        const json = JSON.parse(data.toString());
        const price = json.c;
        resolve(price);
        ws.close();
      } catch (err) {
        reject(`Error parsing Binance data: ${err}`);
        ws.close();
      }
    });

    ws.on('error', (err) => {
      reject(`WebSocket error: ${err.message}`);
    });
  });
}
