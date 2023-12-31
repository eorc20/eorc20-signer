import { APIClient, Chains } from "@wharfkit/session"
import state from "./state.js";
import { sleep } from "./utils.js";

const client = new APIClient(Chains.EOS);

export async function get_block_info(block_num: number) {
    try {
        const response = await client.v1.chain.get_block_info(block_num);
        return {
            block_id: response.id.toString(),
            block_num: response.block_num.toNumber(),
            timestamp: Math.floor(response.timestamp.toMilliseconds() / 1000)
        }
    } catch (e: any) {
        // console.error(e.details)
        return null;
    }
}

export async function isFinalBlock(native_block_id: string, native_block_num: number, retry = 10) {
    // in-memory cached results
    if (state.finalBlocks.has(native_block_id)) return true;

    // continous attempt to match block_id to block_num
    while (retry > 0) {
        const block_info = await get_block_info(native_block_num);
        console.log("isFinalBlock", {block_info, native_block_num, retry})
        if (block_info && block_info.block_id == native_block_id) {
            state.finalBlocks.add(native_block_id);
            return true;
        }
        await sleep(500);
        retry--;
    }
    return false;
}

// console.log(await isFinalBlock("14d67a33d89def6488c03b87f5c0dda54e5d0e6f4bee0c1090b775c8834446bc", 349600307));

// const block_id = "14d5b84091c0823e5f70b162a55ea453696255e017b6544014338c7ce55f82db";
// const response = await client.v1.chain.get_block_header_state(349550656);