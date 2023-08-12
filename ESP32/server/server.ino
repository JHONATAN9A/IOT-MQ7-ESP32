// Libraries to of api rest 
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>


int pines[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
WebServer server(80);


class wifi_controler {
  private:
    const char* name_red;
    const char* password_red;

  public:
    wifi_controler(const char* name, const char* password){
      name_red = name;
      password_red = password;
    }

    void On_connection(){
      Serial.print("wifi: conexion --> ");
      Serial.println(name_red);

      WiFi.begin(name_red, password_red);

      while (WiFi.status() != WL_CONNECTED){
        Serial.print(".");
        delay(500);
      }

      Serial.print("\n wifi: conectado --> ");
      Serial.println(WiFi.localIP());

    }
};

class sensores_controler{
  private:
    int pin_mq_01;
    int pin_mq_02;
    int pin_mq_03;
    int pin_mq_04;
    int pin_mq_05;
    int pin_mq_06;
    int pin_mq_07;
    int pin_mq_08;
    int pin_mq_09;
  
  public:
    sensores_controler(int* pines){
      pin_mq_01 = pines[0];
      pin_mq_02 = pines[1];
      pin_mq_03 = pines[2];
      pin_mq_04 = pines[3];
      pin_mq_05 = pines[4];
      pin_mq_06 = pines[5];
      pin_mq_07 = pines[6];
      pin_mq_08 = pines[7];
      pin_mq_09 = pines[8];

    }

    float sensor_mq_01(){
      return 77.0;
    }
    float sensor_mq_02(){
      return 88.0;
    }
};


class api_rest_controler{ 
  private: 
    sensores_controler sensor;
    
  public:
    api_rest_controler(int port, int* pines): sensor(pines){
      Serial.print("\nServer: Iniciado en el puerto --> ");
      Serial.println(port);
    }

    String serialaicer_json(const char *sensor, float valor) {
      StaticJsonDocument<250> jsonDocument;
      String json_buffer;

      jsonDocument.clear();  
      jsonDocument["sensor_id"] = sensor;
      jsonDocument["valor"] = valor;
      serializeJson(jsonDocument, json_buffer);

      return json_buffer;
    }

    void get_data_mq_01() {
      float valor = sensor.sensor_mq_01();
      String json = serialaicer_json("mq_01", valor);
      Serial.println(json);
      server.send(200, "application/json", json);
    }

    void get_data_mq_02() {
      float valor = sensor.sensor_mq_02();
      String json = serialaicer_json("mq_02", valor);
      Serial.println(json);
      server.send(200, "application/json", json);
    }
};


void setup() {
  Serial.begin(115200);

  const char *SSID = "Esp32";
  const char *PWD = "123456789";

  wifi_controler wifi(SSID, PWD);
  wifi.On_connection();

  api_rest_controler api(80, pines); 
  server.on("/mq_01", HTTP_GET, [&api]() {
    api.get_data_mq_01();
  });
  server.on("/mq_02", HTTP_GET, [&api]() {
    api.get_data_mq_02();
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
