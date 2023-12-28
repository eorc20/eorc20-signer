
import { sleep } from "./utils.js";
import state from "./state.js";
import { getLastPendingTransfer } from "./getLastPendingTransfer.js";
import { getTokensByAddress } from "./getTokensByAddress.js";
import { approve, error } from "./queries.js";
import logUpdate from 'log-update';
import { queue } from "./config.js";
import { handleConfirmation } from "./handleConfirmation.js";

export async function handleLastTransfer(tick: string) {
    // get last pending transfer
    const pendingTransfer = await getLastPendingTransfer(tick);
    if ( !pendingTransfer ) {
        logUpdate(`no pending transfers | approved/errors ${state.approve}/${state.error} (retry=${state.retry++})`);
        await sleep(500);
        queue.add(() => handleLastTransfer(tick));
        return;
    }
    // Values from pending Transfer
    const { id, from, to, block_number } = pendingTransfer;
    const amt = Number(pendingTransfer.amt);
    console.log({pendingTransfer})

    // get available balance
    let availableBalance = await getTokensByAddress(from, tick, block_number);
    if ( availableBalance === null ) {
        console.error(`❌ failed to get balance for ${from}`);
        process.exit(1);
    }

    // compute remaining balance after transfer
    const balance = availableBalance - amt;
    console.log({from, amt, availableBalance, balance})

    // error (5) - cannot transfer to self
    if ( from === to ) {
        await error(id, 5);

    // error (4) - insufficient balance
    } else if ( balance < 0 ) {
        await error(id, 4);

    // error (6) - decimals is invalid
    } else if (amt !== Math.floor(amt) ) {
        await error(id, 6);

    // fallback to approve
    } else {
        await approve(id);
    }
    // confirm transaction
    await sleep(500);
    queue.add(() => handleConfirmation(tick, id));
}
