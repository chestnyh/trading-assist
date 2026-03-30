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
    throw new Error('binance_spot_get_klines: "symbol" is required');
  }

  if (!interval) {
    throw new Error('binance_spot_get_klines: "interval" is required');
  }

  const limit = limitRaw === undefined || limitRaw === null ? 1 : Number(limitRaw);
  if (!Number.isFinite(limit) || limit <= 0 || limit > 1000) {
    throw new Error('binance_spot_get_klines: "limit" must be a number between 1 and 1000');
  }

  const params = new URLSearchParams({
    symbol: String(symbol),
    interval: String(interval),
    limit: String(limit),
  });

  const res = await fetch(`https://api.binance.com/api/v3/klines?${params.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(`binance_spot_get_klines: Binance API error ${res.status} ${res.statusText}: ${bodyText}`);
  }

  const data = JSON.parse(bodyText) as BinanceKlineRaw[];
  const parsed = data.map(parseKline);

  if (limit === 1) {
    const first = parsed[0];
    if (!first) {
      throw new Error('binance_spot_get_klines: empty response from Binance');
    }
    sequenceContext.set(resultKey, first);
    return;
  }

  sequenceContext.set(resultKey, parsed);
}
