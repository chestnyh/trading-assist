import { Injectable } from '@nestjs/common';

import actions from './actions';
import { HeapService } from '../heap/heap.service';

@Injectable()
export class ActionsService {
    constructor(
        private heapService: HeapService
    ) {
        this.loadActions();
    }
    private loadActions() {
        Object.entries(actions).forEach(([actionName, actionHandler]) => {
            this[actionName] = actionHandler;
        });
    }
}