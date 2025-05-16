import { Injectable } from '@nestjs/common';

import ConditionResolver from './condition-resolver/condition-resolver';
import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

import getValue from './utils/get-value.util';
// Actions
import common from './actions/common';
import binance from './actions/binance';
import telegram from './actions/telegram';

@Injectable()
export class ActionsHub {

    private heap: ObjectNavigator = new ObjectNavigator();

    constructor(){
        this.loadActions();
    }

    loadActions(){
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