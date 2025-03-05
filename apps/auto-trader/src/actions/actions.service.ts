import { Injectable } from '@nestjs/common';
import { Spot } from '@binance/connector';

import ConditionResolver from './condition-resolver/condition-resolver';
import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

import getValue from './utils/get-value.util';

@Injectable()
export class ActionsService {

    private heap = new ObjectNavigator();

    /**
     * TODO add description
     * @param args 
     * @param param1 
     */
    add_to_heap (
        args: any, 
        {
            sequenceContext
        }
    ) {
        const { items } = args;
    
        items.forEach(item => {
            const { key, value } = item;
            const res = getValue(value, {heap: this.heap, sequenceContext});
            this.heap.set(key, res);
        });
    };
    
    /**
     * 
     * @param args 
     * @param param1 
     */
    delete_from_heap(
        args: any,
        {
            sequenceContext
        }
    ) {

        const { keys } = args;
        keys.forEach(key => {
            this.heap.delete(key);
        });

    };
    
    /**
     * TODO add description
     * @param args 
     * @param param1 
     */
    async binance_get_ticker (
        args: any, 
        {
            sequenceContext
        }
    ) {
        const {
            symbol
        } = args;
    
        const client = new Spot();
        const { data } = await client.tickerPrice(symbol);
        sequenceContext.set(symbol, data.price);
    };

    /**
     * TODO add description
     * @param args 
     * @param param1 
     */
    if_then(
        args: any, 
        {
            sequenceContext
        }
    ): void {
    
        const { 
            if: condition, 
            then 
        } = args;
    
        const {
            type: conditionType,
            arguments: conditionArguments,
        } = condition;
    
        const {
            type: thenType,
            arguments: thenArguments,
        } = then;
    
        if(this[conditionType](
            conditionArguments, 
            { 
                sequenceContext 
            })){   
            this[thenType](
                thenArguments, 
                {
                    sequenceContext
                });
        }
    
    }

    /**
     * TODO add description
    * @param args 
    * @param heap 
    * @param dependencies 
    */
    interval (
        args: any, 
        { 
            sequenceContext,
            heap
        }) {
            const { 
                do: action, 
                interval 
            } = args;
            
            setInterval(() => {
                const actionType = action.type;
                this[actionType](action.arguments, {
                    sequenceContext,
                    heap
                });
            }, interval);
        }

    /**
     * TODO add description
     * @param args 
     * @param heap 
     * @param dependencies 
     */
    log (
        args: any, 
        {
            sequenceContext
        }
    ) {
        let { 
            message,  
        } = args;

        console.dir(this.heap, {depth: 8});
    
        // const matches = message.match(/\${(.*?)}/g);
    
        // matches.forEach(match  => {
        //     const valueKey = match.replace('${', '').replace('}', '');
        //     const value = getValue(valueKey, {heap: this.heap, sequenceContext});
        //     message = message.replace(match, value);
        // });
    }

    /**
     * TODO add description
     * @param args 
     * @param heap 
     * @param dependencies 
     */
    async parallel (
        args: any, 
        {
            sequenceContext,
        }) {
    
            const { 
                do: actions,  
            } = args;

        const promises = actions.map(action => {
            const actionType = action.type;
            this[actionType](action.arguments, {
                sequenceContext,
            });
        });

        await Promise.all(promises)
    }

    /**
     * TODO add description
     * @param args 
     * @param heap 
     * @param dependencies 
     */
    async sequence (
        args: any, {
            heap
        }) {

        const sequenceContext = new ObjectNavigator();
        
        const { 
            do: actions,  
        } = args;

        for(let action of actions){
            const actionType = action.type;
            await this[actionType](
                action.arguments, 
                {
                    sequenceContext,
                    heap
                });
        }

    }
    
    /**
     * TODO add description
     * @param args 
     * @param heap 
     * @param dependencies 
     * @returns 
     */
    condition (
        args: any, 
        {
            sequenceContext
        }): boolean {
    
        const {
            condition
        } = args;

        const conditionResolver = new ConditionResolver(condition, this.heap, sequenceContext);

        return conditionResolver.resolve();
    
    }

    /**
     * TODO add description
     * @param args 
     * @param heap 
     * @param dependencies 
     */
    async timeout (
        args: any, 
        {
            sequenceContext
        }) {
        
        const { 
            do: action, 
            timeout 
        } = args;

        await new Promise(resolve => setTimeout(resolve, timeout));

        const actionType = action.type;
        await this[actionType](action.arguments, {
            sequenceContext
        });
    }

    /**
     * TODO - Add description
     * @param args 
     * @param param1 
     */
    telegram_send_message (
        args: any, 
        {
            sequenceContext
        }
    ) {
        console.log(args.message)
    };

}