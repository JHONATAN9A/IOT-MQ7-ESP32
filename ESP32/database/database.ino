#include <WiFi.h>
#include <PostgreSQLClient.h>

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



void setup() {
  Serial.begin(115200);

  const char *SSID = "Familia Garnica";
  const char *PWD = "Monochi2023";

  wifi_controler wifi(SSID, PWD);
  wifi.On_connection();

  
}

void loop() {
  
}