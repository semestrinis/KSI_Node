#include <Wire.h>
#include <Adafruit_BMP085.h>
#include <BH1750FVI.h>
#include <SPI.h>
#include <Ethernet.h>
#include "DHT.h"

#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);
BH1750FVI LightSensor(BH1750FVI::k_DevModeContLowRes);
Adafruit_BMP085 bmp;

#define LedRed 7
#define LedGreen 6
#define LedBlue 5

int minTemp = 20;
int maxTemp = 24;

byte mac[] = {0x70, 0x4D, 0x7B, 0x3E, 0x8A, 0x7C};
// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 0, 177);
IPAddress myDns(192, 168, 1, 1);
EthernetClient client;

//char server[] = "https://ksi-projektas.herokuapp.com/api/arduino";  // also change the Host line in httpRequest()
//IPAddress server(188, 226, 137, 35); //188.226.137.35:80
//IPAddress server(192,168,1,102);
//IPAddress server(52,23,225,52);//188.226.137.35
//IPAddress server(99,80,174,196);
char server[] = "ksi-projektas.herokuapp.com";

unsigned long lastConnectionTime = 0;           // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 10 * 1000; // delay between updates, in milliseconds


String response = "";
//
//unsigned long beginMicros, endMicros;
//unsigned long byteCount = 0;
//bool printWebData = true;


void setup()
{
  Serial.begin(9600);
  while (!Serial)
  {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // start the Ethernet connection:
  Serial.println("Initialize Ethernet with DHCP:");
  if (Ethernet.begin(mac) == 0)
  {
    Serial.println("Failed to configure Ethernet using DHCP");
    // Check for Ethernet hardware present
    if (Ethernet.hardwareStatus() == EthernetNoHardware)
    {
      Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
      while (true)
      {
        delay(1); // do nothing, no point running without Ethernet hardware
      }
    }
    if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet cable is not connected.");
    }
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip, myDns);
    Serial.print("My IP address: ");
    Serial.println(Ethernet.localIP());
  }
  else
  {
    Serial.print("  DHCP assigned IP ");
    Serial.println(Ethernet.localIP());
  }
  // give the Ethernet shield a second to initialize:
  delay(1000);

  dht.begin();
  LightSensor.begin();
  if (!bmp.begin())
  {
    Serial.println("Could not find a valid BMP085 sensor, check wiring!");
    while (1) {}
  }
  delay(1000);


//  beginMicros = micros();

  
}

void loop()
{
  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:
  char c;
  
  if (client.available())
  {
    c = client.read();
    response += c;
    Serial.write(c);
  }
  

  String ss = String("" + c);

  // if ten seconds have passed since your last connection,
  // then connect again and send data:
  if (millis() - lastConnectionTime > postingInterval)
  {
    //Serial.print(response);
    Serial.print(response.length());
    Serial.print("\n");
    for(int i=0; i < response.length(); i++)
    {

//      Serial.print(response[i]);
//      Serial.print("\n");
      if(response[i] == 'm' && response[i+1] == 'i' && response[i+2] == 'n' && response[i+3] == ':')
      {
        String mint = "" + response[i+4] + response[i+5];
        minTemp = mint.toInt();
        i += 4;
        Serial.print(mint);
        Serial.print("\n");
        Serial.print("HIT 1");
        Serial.print("\n");
      }
      if(response[i] == 'm' && response[i+1] == 'a' && response[i+2] == 'x' && response[i+3] == ':')
      {
        String maxt = "" + response[i+4] + response[i+5];
        maxTemp = maxt.toInt();
        i += 4;
        Serial.print(maxt);
        Serial.print("\n");
        Serial.print("HIT 2");
        Serial.print("\n");
      }
    }

    Serial.print("\n");
    Serial.print(minTemp);
    Serial.print(maxTemp);
    Serial.print("\n");
    
    httpRequest();
    response = "";
  }
}

// this method makes a HTTP connection to the server:
void httpRequest()
{
  // close any connection before send a new request.
  // This will free the socket on the WiFi shield
  client.stop();

  // if there's a successful connection:
  if (client.connect(server, 80))
  {

    // Reading temperature or humidity takes about 250 milliseconds!
    float humidity = dht.readHumidity();
    // Read temperature as Celsius (the default)
    float temperature1 = dht.readTemperature();

    // Check if any reads failed and exit early (to try again).
    if (isnan(humidity) || isnan(temperature1))
    {
      Serial.println(F("Nepavyko nuskaityti aplinkos temperatūros ir drėgmės matmenų!"));
      return;
    }
    //int temperature1 = 0;
    //int temperature2 = 0;
    //int humidity = 0;
    //int presure = 0;
    //int Ligth = 0;

    if (temperature1 > minTemp && temperature1 < maxTemp)
    {
      digitalWrite(LedGreen, HIGH);
      digitalWrite(LedBlue, LOW);
      digitalWrite(LedRed, LOW);
    }
    else if (temperature1 > minTemp && temperature1 > maxTemp)
    {
      digitalWrite(LedGreen, LOW);
      digitalWrite(LedBlue, LOW);
      digitalWrite(LedRed, HIGH);
    }
    else if (temperature1 < minTemp && temperature1 < maxTemp)
    {
      digitalWrite(LedGreen, LOW);
      digitalWrite(LedBlue, HIGH);
      digitalWrite(LedRed, LOW);
    }


    Serial.print(F("Humidity: "));
    Serial.print(humidity);
    Serial.print(F("%  Temperature: "));
    Serial.print(temperature1);
    Serial.print(F("°C /n"));


    float presure = bmp.readPressure();
    float temperature2 = bmp.readTemperature();
    Serial.print("Temperature = ");
    Serial.print(temperature2);
    Serial.println(" *C");

    Serial.print("Pressure = ");
    Serial.print(presure);
    Serial.println(" Pa");

    uint16_t Ligth = LightSensor.GetLightIntensity();
    Serial.print("Light: ");
    Serial.println(Ligth);

    Serial.println("connecting...");
    String PostData = "";//"appData={\"itemID\":";
    //String itemID = "A56654S";
    //PostData += itemID + ",";


//    PostData += "\"Temperature1\":\"";
//    PostData += temperature1;
//    PostData += "\",\"Humidity\":";
//    PostData += humidity;
//    PostData += ",\"Presure\":";
//    PostData += presure;
//    PostData += ",\"Temperature2\":";
//    PostData += temperature2;
//    PostData += ",\"Ligth\":";
//    PostData += Ligth;

    PostData += "temperature1=";
    PostData += temperature1;    
    PostData += "humidity=";
    PostData += humidity;
    PostData += "temperature2=";
    PostData += temperature2;
    PostData += "presure=";
    PostData += presure;
    PostData += "light=";
    PostData += Ligth;


    

    PostData += "}";
    Serial.println(PostData);



    client.println("POST /api/arduino/newmat1 HTTP/1.1");
    client.println("Host: ksi-projektas.herokuapp.com");
    client.println("User-Agent: AplinkosOroStebejimoStotele_1.1");
    client.println("Connection: close");
    client.println("Content-Type: application/x-www-form-urlencoded;");
    client.println("Cache-Control: no-cache");
    client.println("Accept: */*;");
    client.println("Accept-Encoding: gzip, deflate;");
    client.println("Content-Type: application/x-www-form-urlencoded;");
    client.print("Content-Length: ");
    client.println(PostData.length());
    client.println();
    client.println(PostData);
    //client.println("Data: someRandom data");
    client.println();

    // note the time that the connection was made:
    lastConnectionTime = millis();
    Serial.println("Request sent");

//    while (client.connected())
//    {
//      while (client.available()) 
//      {
//        char thisChar = client.read();
//        //inData += thisChar;
//        Serial.print(thisChar);
//      }
//      client.stop();
//      return 1;
//    }

    

    
    //Serial.println(client.response);

//    if (!client.connected())
//    {
//      
//      endMicros = micros();
//      Serial.println();
//      Serial.println("disconnecting.");
//      client.stop();
//      Serial.print("Received ");
//      Serial.print(byteCount);
//      Serial.print(" bytes in ");
//      float seconds = (float)(endMicros - beginMicros) / 1000000.0;
//      Serial.print(seconds, 4);
//      float rate = (float)byteCount / seconds / 1000.0;
//      Serial.print(", rate = ");
//      Serial.print(rate);
//      Serial.print(" kbytes/second");
//      Serial.println();
//  
//      // do nothing forevermore:
//      while (true) 
//      {
//        delay(1);
//      }
//    }
  }
  else
  {
    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
}
