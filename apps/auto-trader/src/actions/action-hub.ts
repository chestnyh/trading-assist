import { Injectable } from '@nestjs/common';

import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

// Actions
import common from './actions/common';
import binance from './actions/binance';
import telegram from './actions/telegram';

@Injectable()
export class ActionsHub {
    constructor(
    ){
        Object.keys(common).forEach(key => {
            this[key] = common[key].method;
        });

        Object.keys(binance).forEach(key => {
            this[key] = binance[key].method;
        });

        Object.keys(telegram).forEach(key => {
            this[key] = telegram[key].method;
        });
    }
}