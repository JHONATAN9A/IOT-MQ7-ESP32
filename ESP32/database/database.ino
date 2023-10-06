#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <ESP32Time.h>

ESP32Time rtc;

const char* apiUrl = "http://54.175.85.224:8080/regitro_co";
const char* authToken = "4e48262be313e199f0f1de08e64a4c068bd3635a6b9683572ac1ee2a4f13dcc7";

const char* SSID = "iPhone";
const char* PWD = "j123456789";
const int PIN = 32;

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

  rtc.setTime(0, 17, 10, 5, 10, 2023);
}

void loop() {
  int nuevoValor = analogRead(PIN);
  Serial.println("Sensor: " + nuevoValor);

  String formattedDate = rtc.getTime("%Y-%m-%d");
  String formattedTime = rtc.getTime("%H:%M:%S");

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(authToken));
  
  String jsonPayload = "{\"sensor\":\"Sensor 3\",\"hora\":\"" + String(formattedTime) + "\",\"fecha\":\"" + String(formattedDate) + "\",\"valor\":" + nuevoValor + ",\"usuario\":\"Alejandro\",\"codigo\":\"2\",\"prueba\":true}";
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
