import { createClient } from "@clickhouse/client";
import { DATABASE, HOST, PASSWORD } from "../config.js";

export const client = createClient({
    host: HOST,
    password: PASSWORD,
    database: DATABASE,
    clickhouse_settings: {
        async_insert: 0, // 1
    },
    application: "EORC-20 Indexer",
});