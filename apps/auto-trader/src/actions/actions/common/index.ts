import log from './log';
import add_to_heap from './add-to-heap';
import delete_from_heap from './delete-from-heap';
import if_then from './if-then';
import parallel from './parallel';
import sequence from './sequence';
import resolve from './resolve';
import timeout from './timeout';
import interval from './interval';

export default {
    log: {
        method: log
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
    }
}