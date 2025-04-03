#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "";         
const char* password = "";    
const char* serverUrl = "http://192.168.5.143:3000/sensor";  

int TRIG_PIN = 5;
int ECHO_PIN = 18;   

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Conectando");
    }

    Serial.println("Conectado");
    
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
}

void loop() {
    float distance = medirDistancia();
    enviarDados(distance);
    delay(10000);  
}

float medirDistancia() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    float distance = (duration * 0.0343) / 2;  //converter o tempo para cm

    Serial.print("Distância: ");
    Serial.print(distance);
    Serial.println("cm");

    return distance;
}

void enviarDados(float distance) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");

        String payload = "{\"distance\":" + String(distance) + "}";
        int httpResponseCode = http.POST(payload);

        Serial.print("Enviado: ");
        Serial.println(payload);
        Serial.print("Resposta: ");
        Serial.println(httpResponseCode);

        http.end();
    } else {
        Serial.println("Desconectado");
    }
}
