import { WebsocketStream as UMStream} from "@binance/futures-connector";

class BinanceWsClient extends UMStream {

    connected = false;

    streamName;

    waitForOpenResolver = null;
    returnerResolver = null;

    openResolver = (resolve) => {
        this.waitForOpenResolver();
        resolve();
    }

    returner = () => {
        return new Promise((resolve, reject) => {
            this.returnerResolver = resolve;
        });
    }

    messageResolver (resolve, data) {
        this.returnerResolver(data);
        resolve(data)
    }

    constructor(params){
        super(params);

        const open = params.callbacks?.open;
        const message = params.callbacks?.message;

        this.streamName = params.streamName

        this.callbacks.open = async () => {
            // We assume if this happened then connected socket
            this.connected = true;
            if(open && typeof open === 'function'){
                await open(data)
            };
            return new Promise(async (resolve, reject) => {
                this.openResolver(resolve);
            })   
        }

        this.callbacks.message = async (data) => {
            if(message && typeof message === 'function'){
                await message(data)
            };
            return new Promise(async (resolve, reject) => {
                this.messageResolver(resolve, data);
            })
        }
    };

    waitForOpen () {
        return new Promise((resolve, reject) => {
            this.waitForOpenResolver = resolve
        });
    }

    messageGenerator = async function* () {
        while(this.connected){
            yield await this.returner();
        }
    }

    subscribe(){
        super.subscribe(this.streamName)
    }
}

export default BinanceWsClient;