import { getTickerAction } from './binance/GetTickerAction';
import { spotGetKlinesAction } from './binance/SpotGetKlinesAction';
import { spotGetTickerAction } from './binance/SpotGetTickerAction';
import { umFuturesExchangeInfoAction } from './binance/UmFuturesExchangeInfoAction';
import { umFuturesGetTickerAction } from './binance/UmFuturesGetTickerAction';
import { addToHeapAction } from './common/AddToHeapAction';
import { cronAction } from './common/CronAction';
import { debugAction } from './common/DebugAction';
import { deleteFromHeapAction } from './common/DeleteFromHeapAction';
import { forEachAction } from './common/ForEachAction';
import { ifThenAction } from './common/IfThenAction';
import { includesAction } from './common/IncludesAction';
import { intervalAction } from './common/IntervalAction';
import { logAction } from './common/LogAction';
import { parallelAction } from './common/ParallelAction';
import { resolveAction } from './common/ResolveAction';
import { sequenceAction } from './common/SequenceAction';
import { stopSequenceAction } from './common/StopSequenceAction';
import { timeoutAction } from './common/TimeoutAction';
import { sendMessageAction } from './telegram/SendMessageAction';
import { ActionDefinition } from '../types';

// Keys are the rule body action types; their order is the order shown in the action type select.
export const ACTION_DEFINITIONS = {
  log: logAction,
  debug: debugAction,
  add_to_heap: addToHeapAction,
  delete_from_heap: deleteFromHeapAction,
  if_then: ifThenAction,
  parallel: parallelAction,
  sequence: sequenceAction,
  resolve: resolveAction,
  timeout: timeoutAction,
  interval: intervalAction,
  for_each: forEachAction,
  cron: cronAction,
  includes: includesAction,
  stop_sequence: stopSequenceAction,
  binance_get_ticker: getTickerAction,
  binance_spot_get_ticker: spotGetTickerAction,
  binance_spot_get_klines: spotGetKlinesAction,
  binance_um_futures_get_ticker: umFuturesGetTickerAction,
  binance_um_features_exchange_info: umFuturesExchangeInfoAction,
  telegram_send_message: sendMessageAction,
} satisfies Record<string, ActionDefinition>;
