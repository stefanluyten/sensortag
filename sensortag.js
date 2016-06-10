

var async = require('async');

var SensorTag = require('sensortag');
SensorTag.SCAN_DUPLICATES = true;

var Client = require('node-rest-client').Client;
var client = new Client();
var USE_READ = true;

var args = [];

var temp;
var hum;
var id;
var luxo;

SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  id = sensorTag.id;
  
  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  async.series([
      function(callback) {
        console.log('connectAndSetUp');
        sensorTag.connectAndSetUp(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        sensorTag.readSerialNumber(function(error, serial){
          console.log(serial);
          callback();
        });
      },
      function(callback) {
        console.log('enableHumidity');


        sensorTag.enableHumidity( 
            setInterval(function(){
              console.log('readHumidity');
              sensorTag.readHumidity(function(error, temperature, humidity) {
              console.log('\ttemperature = %d °C', temperature.toFixed(1));
              console.log('\thumidity = %d %', humidity.toFixed(1));
              temp = temperature.toFixed(1);
              hum = humidity.toFixed(1);

            });
            },20000)
        );

        sensorTag.enableLuxometer( 
            setInterval(function(){
              console.log('readLuxometer');
              sensorTag.readLuxometer(function(error, lux) {
              console.log('\tlux = %d lux', lux.toFixed(1));
              luxo = lux.toFixed(1);
              
              //args = "{'data': { 'Temperature':"+data.Temperature+",'Humidity':"+data.Humidity+",'Lux':"+data.Lux+"},'headers': { 'Content-Type': 'application/json' }}";

              var args = '{"data": { "id": "'+id+'", "lux": '+luxo+', "Temperature": '+temp+',"Humidity": '+hum+'},"headers": { "Content-Type": "application/json" }}';

              console.log(args);
              client.post("https://dweet.io:443/dweet/for/stefanssensortag1", JSON.parse(args), function (data, response) {});
            });
            },20000)
        );


      },
    ]
  );

});










