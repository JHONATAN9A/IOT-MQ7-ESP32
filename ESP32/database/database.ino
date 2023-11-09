#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <ESP32Time.h>

ESP32Time rtc;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -5 * 3600;
const int daylightOffset_sec = 0;

const char* apiUrl = "http://18.226.17.126:8000/regitro_co";
const char* authToken = "4e48262be313e199f0f1de08e64a4c068bd3635a6b9683572ac1ee2a4f13dcc7";

const char* SSID = "Wokwi-GUEST";
const char* PWD = "";
#define MQ7pin 32
float sensorValue; 
float gasConcentration; 

class wifi_controller {
  private:
    const char* name_red;
    const char* password_red;

  public:
    wifi_controller(const char* name, const char* password) {
      name_red = name;
      password_red = password;
    }

    void On_connection() {
      Serial.print("wifi: conexión --> ");
      Serial.println(name_red);

      WiFi.begin(name_red, password_red);

      while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
      }

      Serial.print("\n wifi: conectado --> ");
      Serial.println(WiFi.localIP());
    }
};

void setup() {
  Serial.begin(115200);

  wifi_controller wifi(SSID, PWD);
  wifi.On_connection();

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {

    int year = timeinfo.tm_year + 1900;
    int month = timeinfo.tm_mon + 1;
    int day = timeinfo.tm_mday;
    int hour = timeinfo.tm_hour;
    int minute = timeinfo.tm_min;
    int second = timeinfo.tm_sec;

    rtc.setTime(second, minute, hour, day, month, year);
  }
  else {
    rtc.setTime(0, 25, 4, 6, 10, 2023);
  }
}

void loop() {


  String formattedDate = rtc.getTime("%Y-%m-%d");
  String formattedTime = rtc.getTime("%H:%M:%S");
  Serial.println(formattedDate);
  Serial.println(formattedTime);

  // Lectura del sensor MQ7
  sensorValue = analogRead(MQ7pin);
  gasConcentration = map(sensorValue, 0, 4095, 20, 2000);


  Serial.println("Gas Concentration: " + String(gasConcentration) + " ppm");

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(authToken));

  String jsonPayload = "{\"sensor\":\"mq7_sensor01\",\"hora\":\"" + String(formattedTime) + "\",\"fecha\":\"" + String(formattedDate) + "\",\"valor\":" + String(gasConcentration) + ",\"usuario\":\"ESP1\",\"codigo\":\"01\",\"prueba\":true}";
  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Respuesta de la API: " + response);
  } else {
    Serial.println("Error en la solicitud a la API");
  }

  http.end();
  delay(3000);
}