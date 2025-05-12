# 🛰️ Signals-Systems – Monitoreo de Monóxido de Carbono en Tiempo Real

Proyecto de IoT enfocado en la recolección, análisis y visualización de datos ambientales (específicamente monóxido de carbono) usando sensores MQ-7, con comunicación a través de una ESP32. El sistema cuenta con una API REST desarrollada en Flask, desplegada en AWS, que permite el almacenamiento en una base de datos PostgreSQL y visualización de los datos en una página web en tiempo real.

## ⚙️ Tecnologías Utilizadas

- ESP32: Recolecta datos desde sensores MQ-7 y los envía en tiempo real vía HTTP.
- MQ-7: Sensor para detección de monóxido de carbono (CO).
- Flask (Python): Framework web para construir la API REST y renderizar la interfaz web.
- PostgreSQL: Base de datos relacional para almacenar las lecturas recibidas.
- AWS EC2: Servidor en la nube que hospeda la API y la interfaz.
- Seguridad: El sistema implementa medidas básicas de autenticación y protección de los endpoints.

## 🔍 Funcionalidad Principal

- Monitoreo de tres sensores MQ-7 conectados a una ESP32.
- Envío de datos en tiempo real a un endpoint Flask expuesto públicamente en AWS.
- Almacenamiento persistente en PostgreSQL.
- Visualización en tiempo real desde una interfaz web desarrollada también en Flask.
- Capa de seguridad para restringir acceso no autorizado a la API.

## 🔐 Seguridad

El sistema incluye una capa básica de seguridad para la API, que puede ser extendida con autenticación JWT, tokens de acceso o control de IPs en producción.

## 📈 Aplicaciones

Este sistema puede ser usado para:

- Monitoreo ambiental en espacios cerrados (garajes, cocinas, fábricas).
- Alerta temprana ante presencia de gases tóxicos.
- Recolección de datos para análisis histórico o integración con sistemas más grandes de gestión ambiental.

## 📌 Notas Adicionales

- El endpoint de Flask debe estar accesible públicamente para que la ESP32 pueda enviar los datos.
- Se recomienda usar HTTPS y autenticación cuando se despliegue el sistema en producción.
