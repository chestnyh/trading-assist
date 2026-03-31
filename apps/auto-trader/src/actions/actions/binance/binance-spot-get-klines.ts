type BinanceKlineRaw = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

type BinanceSpotKline = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteVolume: number;
  trades: number;
};

type BinanceSpotKlineError = {
  error: {
    message: string;
    details?: unknown;
  };
};

function parseKline(raw: BinanceKlineRaw): BinanceSpotKline {
  return {
    openTime: Number(raw[0]),
    open: Number(raw[1]),
    high: Number(raw[2]),
    low: Number(raw[3]),
    close: Number(raw[4]),
    volume: Number(raw[5]),
    closeTime: Number(raw[6]),
    quoteVolume: Number(raw[7]),
    trades: Number(raw[8]),
  };
}

/**
 * Fetches kline (candlestick) data from Binance Spot public API and stores parsed candle fields in sequenceContext.
 *
 * - All price/volume fields are stored as numbers (Binance returns them as strings).
 * - When `limit === 1`, stores a single candle object under `resultKey`.
 * - When `limit > 1`, stores an array of candle objects under `resultKey`.
 * - On error, stores `{ error: { message, details? } }` under `resultKey` and returns (does not throw).
 */
export default async function binance_spot_get_klines(
  args: any,
  { sequenceContext }: { sequenceContext: any }
): Promise<void> {
  const { symbol, interval } = args;
  const limitRaw = args?.limit;

  let { resultKey } = args;
  if (!resultKey) {
    resultKey = `binance_spot_get_klines.${symbol}`;
  }

  if (!symbol) {
    sequenceContext.set(resultKey, {
      error: { message: 'binance_spot_get_klines: "symbol" is required' },
    } satisfies BinanceSpotKlineError);
    return;
  }

  if (!interval) {
    sequenceContext.set(resultKey, {
      error: { message: 'binance_spot_get_klines: "interval" is required' },
    } satisfies BinanceSpotKlineError);
    return;
  }

  const limit = limitRaw === undefined || limitRaw === null ? 1 : Number(limitRaw);
  if (!Number.isFinite(limit) || limit <= 0 || limit > 1000) {
    sequenceContext.set(resultKey, {
      error: {
        message: 'binance_spot_get_klines: "limit" must be a number between 1 and 1000',
        details: { limit: limitRaw },
      },
    } satisfies BinanceSpotKlineError);
    return;
  }

  try {
    const { Spot } = await import('@binance/connector');
    const client = new Spot();
    const { data } = await client.klines(String(symbol), String(interval), { limit });

    const parsed = (data as BinanceKlineRaw[]).map(parseKline);

    if (limit === 1) {
      const first = parsed[0];
      if (!first) {
        sequenceContext.set(resultKey, {
          error: { message: 'binance_spot_get_klines: empty response from Binance' },
        } satisfies BinanceSpotKlineError);
        return;
      }
      sequenceContext.set(resultKey, first);
      return;
    }

    sequenceContext.set(resultKey, parsed);
  } catch (e) {
    sequenceContext.set(resultKey, {
      error: {
        message: 'binance_spot_get_klines: failed to fetch klines from Binance',
        details: e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : e,
      },
    } satisfies BinanceSpotKlineError);
  }
}
