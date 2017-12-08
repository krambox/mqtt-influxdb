#!/usr/bin/env node
var pkg = require('./package.json');
var Mqtt = require('mqtt');
var Influx = require('influx');
var log = require('yalm');
var config = require('./config.js');
log.setLevel(config.verbosity);
log.info(config);

var mqttConnected;
var influxDBConnected;

var buffer = [];
var bufferCount = 0;

var influx;

log.info(pkg.name + ' ' + pkg.version + ' starting');
log.info('mqtt trying to connect', config.url);
var mqtt = Mqtt.connect(config.url, { will: { topic: config.name + '/connected', payload: '0', retain: true } });

mqtt.on('connect', function () {
  mqttConnected = true;

  log.info('mqtt connected', config.url);
  mqtt.publish(config.name + '/connected', '1', { retain: true });

  log.info('mqtt subscribe', config.name + '/set/#');
  mqtt.subscribe(config.name + '/set/#');

  influx = new Influx.InfluxDB({
    host: config['influxHost'],
    port: config['influxPort'],
    database: config['influxDb']
  });
  influx.ping(5000).then(hosts => {
    hosts.forEach(host => {
      if (host.online) {
        influxDBConnected = true;
        log.log(`${host.url.host} responded in ${host.rtt}ms running ${host.version})`);
        mqtt.publish(config.name + '/connected', '2', { retain: true });
      } else {
        log.error(`${host.url.host} is offline :(`);
      }
    });
  });
});

mqtt.on('close', function () {
  if (mqttConnected) {
    mqttConnected = false;
    log.info('mqtt closed ' + config.url);
  }
});

mqtt.on('error', function (err) {
  log.error('mqtt', err);
});

mqtt.on('message', (topic, message) => {
  const topicPrefix = config.name + '/set/';
  if (topic.startsWith(topicPrefix)) {
    const measurement = topic.substring(topicPrefix.length);
    var payload = JSON.parse(message.toString());
    var timestamp = new Date();
    if (payload.ts) { // convert to ms timestamp
      if (payload.ts < 15120042550) {
        payload.ts = payload.ts * 1000;
      }
      timestamp = new Date(payload.ts);
    }
    var point = {
      measurement: measurement,
      tags: payload.tags,
      timestamp: timestamp,
      fields: {}
    };

    if (payload.fields !== undefined) {
      point.fields = payload.fields;
    }
    if (payload.val !== undefined) {
      point.fields.value = payload.val;
    }
    // log.debug(point)
    buffer.push(point);
    bufferCount += 1;
    if (bufferCount >= 1000) writeInflux();
  }
});

function writeInflux () {
  if (!bufferCount) return;
  if (!influxDBConnected) return;
  log.debug('write', bufferCount);

  influx.writePoints(buffer).then(() => {
    log.debug('wrote');
  }).catch(err => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`);
  });

  buffer = [];
  bufferCount = 0;
}

setInterval(writeInflux, 60000);
