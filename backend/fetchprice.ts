import axios from 'axios';

/**
 * Fetches the latest price for a crypto symbol from Binance REST API
 * @param symbol Example: 'BTCUSDT', 'ETHUSDT'
 * @returns Promise<string>
 */
export async function fetchPrice(symbol: string): Promise<string> {
  try {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`;
    const { data } = await axios.get(url);
    return data.price; // returns as a string
  } catch (err) {
    throw new Error(`Failed to fetch price for ${symbol}: ${err}`);
  }
}