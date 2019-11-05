/**
 * Module dependencies.
 */

const constants = require('pm2/constants');
const pm2 = require('pm2');
const Influx = require('influx');
const config = require('./config');

/**
 * Constants.
 */

const influxModel = new Influx.InfluxDB({
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  schema: [
    {
      measurement: config.MEASUREMENT,
      fields: {
        NAME: Influx.FieldType.STRING,
        CPU: Influx.FieldType.FLOAT,
        MEM: Influx.FieldType.FLOAT,
        PROCESS_ID: Influx.FieldType.INTEGER
      },
      tags: [
        'application',
        'host'
      ]
    }
  ]
});

/**
 * Status mapper.
 */

const statusMapper = [
  [constants.ERRORED_STATUS],
  [constants.LAUNCHING_STATUS],
  [constants.ONE_LAUNCH_STATUS],
  [constants.ONLINE_STATUS],
  [constants.STOPPED_STATUS],
  [constants.STOPPING_STATUS]
]

/**
 * Push metrics to Influx.
 */

async function start() {
  pm2.list((err, processes) => {

    const measurements = processes.map(process => {
      return {
        fields: {
          NAME: process.name || null,
          CPU: process.monit.cpu || 0,
          MEM: process.monit.memory || 0,
          PROCESS_ID: process.pid || 0
        },
        tags: {
          application: process.name,
          host: config.HOST
        },
        measurement: config.MEASUREMENT
      }
    })

    influxModel.writePoints(measurements)
      .then(start)
      .catch(start)

  });
}

start();