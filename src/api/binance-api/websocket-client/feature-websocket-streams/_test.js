/**
 * This file used to run tests on api in index file
 */
import {miniTicker} from './index.js'

async function generate() {

    const client = miniTicker("BNBUSDT");

    client.subscribe();

    await client.waitForOpen()

    for await (const val of client.messageGenerator()) {
        console.log(JSON.parse(val));
    }
}
  
generate();