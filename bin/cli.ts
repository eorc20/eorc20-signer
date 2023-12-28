#!/usr/bin/env node

import { HOST, PAUSED, TICKS, queue } from "../src/config.js";
import { client } from "../src/clickhouse/createClient.js";
import { handleLastTransfer } from "../src/handleLastTransfer.js";

if ( PAUSED ) {
    console.log("Paused");
    process.exit(0);
}

try {
    const { success } = await client.ping();
    if (!success) throw new Error(`Clickhouse ${HOST} connection failed`);
} catch (e) {
    console.error(e);
    process.exit(0);
}

console.log(`EORC-20 signer 🚀 [${TICKS.join(",")}]`);

// add ticks to queue
for (const tick of TICKS) {
    queue.add(() => handleLastTransfer(tick));
}
