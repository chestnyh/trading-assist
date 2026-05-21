import { Injectable } from '@nestjs/common';

import ObjectNavigator from '@trading-bot/object-navigator';

import { RuleLogsService } from '../auto-trader/rule-logs.service';

// Actions
import common from './actions/common';
import binance from './actions/binance';
import telegram from './actions/telegram';

@Injectable()
export class ActionsHub {

    public heap: ObjectNavigator;
    public ruleId: number;
    public userId: number;
    public runId: string;
    public ruleLogsService: RuleLogsService | null;
    private disposers: Array<() => void> = [];
    constructor(
        ruleId: number,
        userId: number,
        private ruleBody: any,
        private settings: any,
        runId: string,
        ruleLogsService: RuleLogsService | null,
    ){
        this.heap = new ObjectNavigator();
        this.ruleId = ruleId;
        this.userId = userId;
        this.runId = runId;
        this.ruleLogsService = ruleLogsService;

        Object.keys(common).forEach(key => {
            this[key] = common[key].method.bind(this);
        });

        Object.keys(binance).forEach(key => {
            this[key] = binance[key].method.bind(this);
        });

        Object.keys(telegram).forEach(key => {
            this[key] = telegram[key].method.bind(this);
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
                /* disposal is best-effort */
            }
        }
        this.disposers = [];
    }

    
}