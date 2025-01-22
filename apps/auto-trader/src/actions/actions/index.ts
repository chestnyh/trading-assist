import condition from './condition/condition.action';
import if_then from './if_then/if_then.action';
import interval from './interval/interval.action';
import timeout from './timeout/timeout.action';
import log from './log/log.action';
import sequence from './sequence/sequence.action';
import parallel from './parallel/parallel.action';

const actions = {
    condition,
    if_then,
    interval,
    timeout,
    log,
    sequence,
    parallel
}

export default actions;