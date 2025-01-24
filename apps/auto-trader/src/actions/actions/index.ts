import condition from './condition/condition.action';
import if_then from './if_then/if_then.action';
import interval from './interval/interval.action';
import timeout from './timeout/timeout.action';
import log from './log/log.action';
import sequence from './sequence/sequence.action';
import parallel from './parallel/parallel.action';
import add_to_heap from './add_to_heap/add_to_heap.action';
import binance_get_ticker from './binance_get_ticker/binance_get_ticker.action';

const actions = {
    condition,
    if_then,
    interval,
    timeout,
    log,
    sequence,
    parallel,
    add_to_heap,
    binance_get_ticker
}

export default actions;