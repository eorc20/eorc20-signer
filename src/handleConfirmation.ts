
import { sleep } from "./utils.js";
import { confirmTransaction } from "./queries.js";
import { Hex } from "viem";
import { queue } from "./config.js";
import { handleLastTransfer } from "./handleLastTransfer.js";

export async function handleConfirmation(tick: string, id: Hex) {
    const confirmed = await confirmTransaction(id);
    if ( confirmed ) {
        console.log(`✅ confirmed id = ${id}\n`);
        await sleep(500);
        queue.add(() => handleLastTransfer(tick))
    } else {
        console.warn(`⚠️ NOT confirmed id = ${id}`);
        await sleep(500);
        queue.add(() => handleConfirmation(tick, id));
    }
}
