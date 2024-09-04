import { Injectable } from '@nestjs/common';

@Injectable()
export class CollectorService {
    getSomeInformation(){
        return {"some": "information"}
    }
}
