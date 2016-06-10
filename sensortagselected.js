var async = require('async');

var SensorTag = require('sensortag');
SensorTag.SCAN_DUPLICATES = true;

var Client = require('node-rest-client').Client;
var client = new Client();

var frequency = 30000;

var temp;
var hum;
var id;
var luxo;

SensorTag.discoverByAddress("b0:b4:48:c8:33:07",function(sensorTag){
  console.log("3307 discovered");
  sensorTag.connectAndSetup(function () {
  console.log('Connect and setup');

    async.series([
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        console.log('enableHumidity');

        sensorTag.enableHumidity( 
            setInterval(function(){
              console.log('readHumidity');
              sensorTag.readHumidity(function(error, temperature, humidity) {
              console.log(sensorTag.address,'\ttemperature = ', temperature.toFixed(1));
              console.log(sensorTag.address,'\thumidity = ', humidity.toFixed(1));
              temp = temperature.toFixed(1);
              hum = humidity.toFixed(1);

            });
            },frequency)
        );

        sensorTag.enableLuxometer( 
            setInterval(function(){
              console.log('readLuxometer');
              sensorTag.readLuxometer(function(error, lux) {
              console.log(sensorTag.address,'\tlux = ', lux.toFixed(1));
              luxo = lux.toFixed(1);
              
              var args = '{"data": { "id": "Inside","Lux": '+luxo+', "Temperature": '+temp+',"Humidity": '+hum+'},"headers": { "Content-Type": "application/json" }}';

              //console.log(args);
              client.post("https://dweet.io:443/dweet/for/stefanssensortagbinnen", JSON.parse(args), function (data, response) {});
            });
            },frequency)
        );


      },
    ]);

  });
});

SensorTag.discoverByAddress("b0:b4:48:c9:3f:07",function(sensorTag){
  console.log("3f07 discovered");
  sensorTag.connectAndSetup(function () {
  console.log('Connect and setup');

    async.series([
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        console.log('enableHumidity');


        sensorTag.enableHumidity( 
            setInterval(function(){
              console.log('readHumidity');
              sensorTag.readHumidity(function(error, temperature, humidity) {
              console.log(sensorTag.address,'\ttemperature = ', temperature.toFixed(1));
              console.log(sensorTag.address,'\thumidity = ', humidity.toFixed(1));
              temp = temperature.toFixed(1);
              hum = humidity.toFixed(1);

            });
            },frequency)
        );

        sensorTag.enableLuxometer( 
            setInterval(function(){
              console.log('readLuxometer');
              sensorTag.readLuxometer(function(error, lux) {
              console.log(sensorTag.address,'\tlux = ', lux.toFixed(1));
              luxo = lux.toFixed(1);
              
              var args = '{"data": { "Location": "Outside","Lux": '+luxo+', "Temperature": '+temp+',"Humidity": '+hum+'},"headers": { "Content-Type": "application/json" }}';

              //console.log(args);
              client.post("https://dweet.io:443/dweet/for/stefanssensortagbuiten", JSON.parse(args), function (data, response) {});
            });
            },frequency)
        );


      },
    ]);
  });
});
