import { Hex } from "viem";
import { client } from "./clickhouse/createClient.js";
import { clientQuery } from "./clickhouse/query.js";
import state from "./state.js";

export async function approve(id: Hex) {
    const query = `
        INSERT INTO approve_transfer SELECT '${id}'
    `
    await client.exec({ query })
    state.approve++;
    console.log(`➡️ approve_transfer transfer id = ${id}`);
}

export async function error(id: Hex, code: number) {
    const query = `
        INSERT INTO errors_transfer SELECT '${id}', ${code}
    `
    await client.exec({ query })
    state.error++;
    console.log(`🚨 errors.transfer (code=${code}) id = ${id}`);
}

export async function confirmTransaction(id: Hex) {
    const query = `
        SELECT id FROM (
            SELECT id FROM approve_transfer WHERE approve_transfer.id = {id: String}
            UNION ALL
            SELECT id FROM errors_transfer WHERE errors_transfer.id = {id: String}
        ) GROUP BY id
    `;
    const response = await clientQuery<{ id: string }>({ query, query_params: { id } });
    if ( !response.data.length ) return false;
    return true;
}

// confirmTransaction("0x19b37d87d35a2a2dfabb69147c9148b97d68d42d7b97cc1021ed163d9a098c52").then(console.log);