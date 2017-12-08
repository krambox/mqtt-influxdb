# mqtt2influxdb

[![NPM version](https://badge.fury.io/js/mqtt2influxdb.svg)](http://badge.fury.io/js/mqtt2influxdb)
[![Dependency Status](https://img.shields.io/gemnasium/krambox/mqtt2influxdb.svg?maxAge=2592000)](https://gemnasium.com/github.com/krambox/mqtt2influxdb)
[![Build Status](https://travis-ci.org/krambox/mqtt2influxdb.svg?branch=master)](https://travis-ci.org/krambox/mqtt2influxdb)
[![Maintainability](https://api.codeclimate.com/v1/badges/323bbf948a25557a2406/maintainability)](https://codeclimate.com/github/krambox/mqtt2influxdb/maintainability)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Written and (C) 2015-17 Kai Kramer
Build with https://github.com/hobbyquaker/xyz2mqtt-skeleton from Sebastian Raff.

Provided under the terms of the MIT license.

## Overview

mqtt2influxdb is a gateway between MQTT with the  https://github.com/mqtt-smarthome topic and payload format and influxdb. mqtt2influxdb is designed to work with https://github.com/hobbyquaker/mqtt-scripts 

## Installation

The recommended away is via docker hub.

    docker run --env-file ./mqtt2influxdb.env -it mqtt2influxdb krambox/mqtt2influxdb

Or via direct call

    ./mqtt2influxdb.js -u mqtt://192.168.1.13 -k 192.168.1.162 -p <AES key>


## Build and run local Docker container

    docker build -t mqtt2influxdb .

    docker run --env-file ./mqtt2influxdb.env -it km200 krambox/mqtt2influxdb 

    docker run --env-file /Volumes/data/smarthome/mqtt2influxdb.env -v /Volumes/data/smarthome:/data --name buderus2mqtt krambox/mqtt2influxdb