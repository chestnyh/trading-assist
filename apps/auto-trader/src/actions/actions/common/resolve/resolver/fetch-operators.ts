import {getValue} from '../../../../utils'

const fetchOperators = {
    __var (varKey): boolean {
        return getValue(varKey, {heap: this.heap, sequenceContext: this.sequenceContext});
    },
    __const (constValue): boolean {
        return constValue;
    }
}

export default fetchOperators;