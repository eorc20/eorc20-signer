# `EORC-20` Signer

> Allows to sign `EORC-20` inscription operations.

## Install

```bash
$ gh repo clone pinax-network/eorc20-signer
$ cd eorc20-signer
$ npm install
```

## Requirements

- [ClickHouse DB](https://clickhouse.com/)
- [EORC-20 indexer](https://github.com/pinax-network/eorc20-indexer)

## Usage

```bash
$ npm start
```

**.env**

```env
# Clickhouse DB
USERNAME=default
PASSWORD=''
HOST=http://localhost:8123
PAUSED=false
```
