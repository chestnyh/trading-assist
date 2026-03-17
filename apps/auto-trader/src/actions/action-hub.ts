import { Injectable } from '@nestjs/common';

import ObjectNavigator from '@trading-bot/object-navigator';

// Actions
import common from './actions/common';
import binance from './actions/binance';
import telegram from './actions/telegram';

@Injectable()
export class ActionsHub {

    private heap: ObjectNavigator;
    private disposers: Array<() => void> = [];
    constructor(
        private ruleBody: any,
        private settings: any,
    ){
        this.heap = new ObjectNavigator();

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

    addDisposer(disposer: () => void): void {
        this.disposers.push(disposer);
    }

    run(){


        const {
            type, 
            arguments: args
        } = this.ruleBody;

        console.log(type);
        
        this[type](
            args, 
            {},
            this.settings
        );



    }

    dispose(): void {
        for (const d of this.disposers) {
            try {
                d();
            } catch {
            }
        }
        this.disposers = [];
    }

    
}