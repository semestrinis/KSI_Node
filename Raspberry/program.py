#!/usr/bin/python3
import Adafruit_DHT
import Adafruit_BMP.BMP085 as BMP085
import requests
import time
import RPi.GPIO as GPIO
from pprint import pprint
import smbus

DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4
URL = "https://ksi-projektas.herokuapp.com/api/arduino/newmat1"
redLed = 12
blueLed = 8
greenLed = 10
whiteLed = 11

GPIO.setwarnings(False)    # Ignore warning for now
GPIO.setmode(GPIO.BOARD)   # Use physical pin numbering
GPIO.setup(blueLed, GPIO.OUT, initial=GPIO.LOW)   # Set pin 8 to be an output pin and set initial value to low (off)
GPIO.setup(redLed, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(greenLed, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(whiteLed, GPIO.OUT, initial=GPIO.LOW)
GPIO.output(whiteLed, GPIO.HIGH)


minTemp = 20.0
maxTemp = 24.0

# Define some constants from the datasheet
DEVICE     = 0x23 # Default device I2C address
POWER_DOWN = 0x00 # No active state
POWER_ON   = 0x01 # Power on
RESET      = 0x07 # Reset data register value
 
# Start measurement at 4lx resolution. Time typically 16ms.
CONTINUOUS_LOW_RES_MODE = 0x13
# Start measurement at 1lx resolution. Time typically 120ms
CONTINUOUS_HIGH_RES_MODE_1 = 0x10
# Start measurement at 0.5lx resolution. Time typically 120ms
CONTINUOUS_HIGH_RES_MODE_2 = 0x11
# Start measurement at 1lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_HIGH_RES_MODE_1 = 0x20
# Start measurement at 0.5lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_HIGH_RES_MODE_2 = 0x21
# Start measurement at 1lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_LOW_RES_MODE = 0x23
 
#bus = smbus.SMBus(0) # Rev 1 Pi uses 0
bus = smbus.SMBus(1)  # Rev 2 Pi uses 1
 
def convertToNumber(data):
  # Simple function to convert 2 bytes of data
  # into a decimal number
  return ((data[1] + (256 * data[0])) / 1.2)
 
def readLight(addr=DEVICE):
  data = bus.read_i2c_block_data(addr,ONE_TIME_HIGH_RES_MODE_1)
  return convertToNumber(data)



while True:
    GPIO.output(redLed, GPIO.LOW)
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

    if humidity is not None and temperature is not None:
        print("Temp={0:0.1f}*C  Humidity={1:0.1f}%".format(temperature, humidity))
    else:
        print("Failed to retrieve data from humidity sensor")
    sensor = BMP085.BMP085()
    temp = sensor.read_temperature()
    pressure = sensor.read_pressure()

    print('Temp = {0:0.2f} *C'.format(temp))
    print('Pressure = {0:0.2f} Pa'.format(pressure))
    
    ligth = readLight()
    print("Light Level : " + str(ligth) + " lux")
    # defining a params dict for the parameters to be sent to the API
    data = {'temperature1':temperature,
            'humidity':humidity,
            'temperature2':temp,
            'presure':pressure,
            'light':ligth,}
    # sending post request and saving response as response object
    r = requests.post(url = URL, data = data)

    try:
        print(r.text)
        data = r.json()
#       pprint(data)

        maxTemp = data['results'][0]['Max_Temp']
        minTemp = data['results'][0]['Min_Temp']

        GPIO.output(whiteLed, GPIO.LOW)
    except:
        GPIO.output(whiteLed, GPIO.HIGH)
        print("ParsingError")

    if (temperature < minTemp and temperature < maxTemp):
        GPIO.output(blueLed, GPIO.HIGH)
        GPIO.output(greenLed, GPIO.LOW)
        GPIO.output(redLed, GPIO.LOW)
    elif (temperature > minTemp and temperature < maxTemp):
        GPIO.output(blueLed, GPIO.LOW)
        GPIO.output(greenLed, GPIO.HIGH)
        GPIO.output(redLed, GPIO.LOW)
    elif (temperature > minTemp and temperature > maxTemp):
        GPIO.output(blueLed, GPIO.LOW)
        GPIO.output(greenLed, GPIO.LOW)
        GPIO.output(redLed, GPIO.HIGH)



    print(minTemp)
    print(maxTemp)
    print("Cycle Done")

#    GPIO.output(blueLed, GPIO.HIGH) # Turn on
#    GPIO.output(greenLed, GPIO.HIGH)
#    GPIO.output(redLed, GPIO.HIGH)
#    time.sleep(1) # Sleep for 1 second
#    GPIO.output(blueLed, GPIO.LOW) # Turn off
#    GPIO.output(greenLed, GPIO.LOW)
#    GPIO.output(redLed, GPIO.LOW)
#    time.sleep(1) # Sleep for 1 second

    time.sleep(10)


