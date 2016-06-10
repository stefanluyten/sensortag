# sensortag
Some sample nodejs code for the TI SensorTag CC2650

This code requires the following packages:
- noble
- async
- sensortag
- node-rest-client (optional)

sensortag.js: connect to a single, unspecified, TI Sensortag to retrieve temp, lux and humidity data
sensortagselected.js: only connect to specified TI Sensortag addresses to retrieve temp, lux and humidity data
