import moment from "moment";
import {
  sqlEmptyValue,
  stringifyForDisplay, wrapWithBrackets,
} from "../utils/export";
import {
  mongoEmptyValue, mongoFormatOp1, mongoFormatOp2,
} from "../utils/mongoUtils";
import {
  spelFixList, spelEscape,
} from "../utils/spelUtils";
import {escapeRegExp} from "../utils/stuff";
import {getTitleInListValues} from "../utils/listValues";


const ctx = {
  utils: {
    moment,
    mongoFormatOp1,
    mongoFormatOp2,
    mongoEmptyValue,
    escapeRegExp,
    sqlEmptyValue,
    stringifyForDisplay,
    getTitleInListValues,
    spelEscape,
    spelFixList,
    wrapWithBrackets,
  },
};

export default ctx;
