var pkg = require('./package.json');
var config = require('yargs')
  .env('INFLUXDB')
  .usage(pkg.name + ' ' + pkg.version + '\n' + pkg.description + '\n\nUsage: $0 [options]')
  .describe('v', 'possible values: "error", "warn", "info", "debug"')
  .describe('n', 'instance name. used as mqtt client id and as prefix for connection-state topic')
  .describe('u', 'mqtt broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
  .describe('h', 'show help')
  .alias({
    'c': 'config',
    'h': 'help',
    'n': 'name',
    'u': 'url',
    'v': 'verbosity',
    'i': 'influxHost',
    'p': 'influxPort',
    'd': 'influxDb'

  })
  .default({
    'u': 'mqtt://127.0.0.1',
    'n': 'influx',
    'v': 'info',
    'i': '127.0.0.1',
    'p': 8086,
    'd': 'mqtt'
  })
  .config('config')
  .version(pkg.name + ' ' + pkg.version + '\n', 'version')
  .help('help')
  .argv;

module.exports = config;
