#!/usr/bin/env node
var mqtt    = require('mqtt');
var influx = require('influx');

var username = 'root';
var password = 'root';
var database = 'home';
var influxClient = influx({host : 'localhost', username : username, password : password, database : database});


var client  = mqtt.connect('mqtt://mac-server.local');


var fs = require('fs');
var util = require('util');
var csv = fs.createWriteStream(__dirname + '/km200.csv', {flags : 'a'});


var topics = [
  //'km200/gateway/DateTime',
  'km200/system/sensors/temperatures/outdoor_t1',
  'km200/system/sensors/temperatures/chimney',
  'km200/system/sensors/temperatures/hotWater_t1',
  'km200/system/sensors/temperatures/supply_t1_setpoint',
  'km200/system/sensors/temperatures/supply_t1',
  'km200/heatSources/flameCurrent',
  'km200/heatSources/numberOfStarts',
  'km200/heatSources/actualPower',
  'km200/heatSources/powerSetpoint',
  'km200/heatSources/workingTime/totalSystem',
  'km200/heatSources/workingTime/secondBurner',
  'km200/heatSources/workingTime/centralHeating',
  'km200/dhwCircuits/dhw1/workingTime',
  'km200/dhwCircuits/dhw1/setTemperature',
  'km200/heatingCircuits/hc1/roomtemperature',
  'km200/heatingCircuits/hc1/temperatureRoomSetpoint',
  'eibd/0/1/0',
  'eibd/2/1/0',
  'eibd/2/1/1',
  'eibd/2/1/10',
  'eibd/2/1/11',
  'eibd/2/1/12'
];

var dataCache = {};
var changeCache = {};


for(var i=0;i<topics.length;++i) {
  client.subscribe(topics[i]);
}

client.on('message', function (topic, message) {
    if (dataCache[topic.toString()] != message) {
      dataCache[topic.toString()] = message;
      var point = { value : parseFloat(message)};
      influxClient.writePoint(topic, point , function(err) {
        if(err) console.log(err); else console.log(topic,point);
      });      
    }
    else {
      console.log("unchanged",topic);
    }
    dataCache[topic.toString()] = message.toString();
});

function logCSV() {
  var point = {};
  
  for(var i=0;i<topics.length;++i) {
    point[topics[i]]=parseFloat(dataCache[topics[i]]);    
  }
  influxClient.writePoint('temp', point);
  console.log(point);
}

var timer = setInterval(logCSV, 60000);




//client.end();

