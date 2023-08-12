// Libraries to of api rest 
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>


int pines[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};


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

class sensores_controler(){
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

    }

    float sensor_mq_01(){

    }
}

class api_rest_controler(){
  private:
    StaticJsonDocument<250> jsonDocument;
    char json_buffer[250];

  public:
    api_rest_controller(int port){
      WebServer server(port);
      Serial.print("\n server: Inciado en el port --> ");
      Serial.println(port);
    }

    void serialaicer_json(char *sensor, float valor){
      jsonDocument.clear();  
      jsonDocument["sensor_id"] = sensor;
      jsonDocument["valor"] = valor;
      serializeJson(jsonDocument, json_buffer);
    }

    void get_data_mq_01(){
      
      server.send(200, "application/json", buffer);
    }
}

void setup() {
  Serial.begin(9600);

  const char *SSID = "Esp32";
  const char *PWD = "123456789";

  wifi_controler wifi(SSID, PWD);
  wifi.On_connection();
}

void loop() {
  // Coloca tu código principal aquí, para que se ejecute repetidamente
}
