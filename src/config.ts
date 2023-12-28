import "dotenv/config";
import pQueue from "p-queue";

// Defaults
export const DEFAULT_HOST = "http://localhost:8123";
export const DEFAULT_DATABASE = "default";
export const DEFAULT_USERNAME = "default";
export const DEFAULT_PASSWORD = "";

export const VERBOSE = true;
export const PAUSED = process.env.PAUSED === "true";

// ClickHouse
export const HOST = process.env.HOST ?? DEFAULT_HOST;
export const PASSWORD = process.env.PASSWORD ?? DEFAULT_PASSWORD;
export const DATABASE = process.env.DATABASE ?? DEFAULT_DATABASE;
export const TICKS = (process.env.TICKS ?? 'eoss').split(",");

export const queue: pQueue = new pQueue({ concurrency: 1 });