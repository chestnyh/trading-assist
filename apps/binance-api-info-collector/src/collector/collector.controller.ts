import { CollectorService } from './collector.service';

export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {
    this.init();
  }

  init (): undefined{
    // TODO add all requests and savings here
  }
}
