const util = require('util');
const fetch = require('node-fetch')

const { Client } = require('tplink-smarthome-api');
const client = new Client();

var logEvent = function (eventName, device, state) {
  const stateString = (state != null ? util.inspect(state) : '');
  console.log(`${(new Date()).toISOString()} ${eventName} ${device.model} ${device.host}:${device.port} ${stateString}`);
};

// Name your IFTTT triggers and use that name in the script
// You'll also need your IFTTT maker key from https://www.ifttt.com/maker
var postEvent = function (eventName) {
  const iftttKey = '';
  fetch('https://maker.ifttt.com/trigger/' + eventName + '/with/key/' + iftttKey, { method: 'GET'})
    .then((json) => {
      console.log(json)
    });
};

// Client events `device-*` also have `bulb-*` and `plug-*` counterparts.
// Use those if you want only events for those types and not all devices.
client.on('device-new', (device) => {
  logEvent('device-new', device);
  device.startPolling(500);

  // Device (Common) Events
  //device.on('emeter-realtime-update', (emeterRealtime) => { logEvent('emeter-realtime-update', device, emeterRealtime); });

  // Plug Events
  device.on('power-on', () => { 
	logEvent('power-on', device);
	postEvent('switchon');
  });
  device.on('power-off', () => { 
	logEvent('power-off', device); 
	postEvent('switchoff');
  });

  // Other Plug Events
  // device.on('power-update', (powerOn) => { logEvent('power-update', device, powerOn); });
  // device.on('in-use', () => { logEvent('in-use', device); });
  // device.on('not-in-use', () => { logEvent('not-in-use', device); });
  // device.on('in-use-update', (inUse) => { logEvent('in-use-update', device, inUse); });

  // Bulb Events
  // device.on('lightstate-on', (lightstate) => { logEvent('lightstate-on', device, lightstate); });
  // device.on('lightstate-off', (lightstate) => { logEvent('lightstate-off', device, lightstate); });
  // device.on('lightstate-change', (lightstate) => { logEvent('lightstate-change', device, lightstate); });
  // device.on('lightstate-update', (lightstate) => { logEvent('lightstate-update', device, lightstate); });

});

client.on('device-online', (device) => { logEvent('device-online', device); });
client.on('device-offline', (device) => { logEvent('device-offline', device); });

console.log('Discovering Kasa devices on your network ...');

// change IP address to match your network
client.startDiscovery({broadcast:"192.168.0.255"});
