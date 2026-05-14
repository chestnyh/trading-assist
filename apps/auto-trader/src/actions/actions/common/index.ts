import log from './log/log.action';
import debug from './debug/debug.action';
import add_to_heap from './add-to-heap/add-to-heap.action';
import delete_from_heap from './delete-from-heap/delete-from-heap.action';
import if_then from './if-then/if-then.action';
import parallel from './parallel/parallel.action';
import sequence from './sequence/sequence.action';
import resolve from './resolve/resolve.action';
import timeout from './timeout/timeout.action';
import interval from './interval/interval.action';
import for_each from './for-each/for-each.action';
import cron from './cron/cron.action';

export default {
    log: {
        method: log
    },
    debug: {
        method: debug
    },
    add_to_heap: {
        method: add_to_heap
    },
    delete_from_heap: {
        method: delete_from_heap
    },
    if_then: {
        method: if_then
    },
    parallel: {
        method: parallel
    },
    sequence: {
        method: sequence
    },
    resolve: {
        method: resolve
    },
    timeout: {
        method: timeout
    },
    interval: {
        method: interval
    },
    for_each: {
        method: for_each
    },
    cron: {
        method: cron
    }
}