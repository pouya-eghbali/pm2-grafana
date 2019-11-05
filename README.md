# PM2 Grafana

This is a PM2 module that sends PM2 stats to an Influx database.
This data can then be used to make a dashboard in Grafana.

Expects a config file:

```js
module.exports = {
  DB_HOST: 'DB_HOST',
  DB_PORT: 8086,
  DB_USER: 'DB_USER',
  DB_PASS: 'DB_PASS',
  DB_NAME: 'DB_NAME',
  MEASUREMENT: 'MEASUREMENT',
  HOST: 'HOST'
}
```

# Usage

Clone this repo, cd, make a config file, then install:

```bash
pm2 install .
```