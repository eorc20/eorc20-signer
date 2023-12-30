import { APIClient, Chains } from "@wharfkit/session"
import state from "./state.js";
import { sleep } from "./utils.js";

const client = new APIClient(Chains.EOS);

export async function get_block_header_state(block_num_or_id: string | number) {
    try {
        const response = await client.v1.chain.get_block(block_num_or_id);
        return {
            block_num: response.block_num.toNumber(),
            block_id: response.id.toString(),
        }
    } catch (e) {
        // console.error(e)
        return null;
    }
}

export async function isFinalBlock(native_block_id: string, native_block_num: number, retry = 10) {
    // in-memory cached results
    if (state.finalBlocks.has(native_block_id)) return true;

    // continous attempt to match block_id to block_num
    while (retry > 0) {
        const header_state = await get_block_header_state(native_block_id);
        console.log("isFinalBlock", {header_state, native_block_num, retry})
        if (header_state && header_state.block_num == native_block_num) {
            state.finalBlocks.add(native_block_id);
            return true;
        }
        await sleep(500);
        retry--;
    }
    return false;
}

// console.log(await isFinalBlock("14d5b84091c0823e5f70b162a55ea453696255e017b6544014338c7ce55f82db", 349550656));