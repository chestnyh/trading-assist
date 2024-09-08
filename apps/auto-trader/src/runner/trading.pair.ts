interface TradingPairParams {
    code: string; // TODO add description;
}

/**
 * 
 */
export class TradingPair {

    private code;

    constructor(params: TradingPairParams){
        this.code = params.code;
    }

}