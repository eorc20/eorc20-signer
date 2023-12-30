import { Address, Hex } from "viem";
import { client } from "./clickhouse/createClient.js";

export interface Transfer {
    id: Hex;                      // '0x0000a9f816e9ac1524131d29b556f0d5efbbb5f28808bc26aacbe1ff57889421'
    from: Address;                // '0x0bfad84c7650e9c55fde12402c0d36e75d23fa1b'
    to: Address;                  // '0x367fa1a7135335c21cef87c6289e7de11cf4647a'
    p: string;                    // 'eorc20'
    op: string;                   // 'transfer'
    tick: string;                 // 'eoss'
    amt: string;                  // '260'
    block_number: number;         // 22983395
    native_block_number: number;  // 348904845
    native_block_id: string;      // '14cbdd8de00c5a3e23727a821cf706815ef35740f1728a478b65b0db4c772dfd'
    timestamp: string;            // '2023-12-27 02:34:43'
    transaction_index: number;    // 6
}

export async function getLastPendingTransfer(tick: string, delay_seconds: number = 6) {
    const query = `
SELECT * FROM transfer
WHERE
tick = {tick: String} AND
id NOT IN (SELECT id FROM errors_transfer WHERE errors_transfer.id = id) AND
id NOT IN (SELECT id FROM approve_transfer WHERE approve_transfer.id = id) AND
timestamp <= {timestamp: Int}
ORDER BY (block_number, transaction_index)
LIMIT 1`;
    // wait before confirming transfer transaction
    const timestamp = Math.floor(Date.now() / 1000) - delay_seconds;
    const response = await client.query({query, query_params: {tick, timestamp}});
    const data = await response.json<{data: Transfer[], rows: number}>();
    if ( !data.data.length ) return null;
    return data.data[0];
}
