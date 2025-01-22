import { Injectable } from '@nestjs/common';

import actions from './actions';

@Injectable()
export class ActionsService {
    constructor() {
        this.loadActions();
    }
    private loadActions() {
        Object.entries(actions).forEach(([actionName, actionHandler]) => {
            this[actionName] = actionHandler;
        });
    }
}