# Signals-Systems
ESP32 || Python || Arduino || Rest API || MQ-7

## Instalación
1. Clonar el proyecto desde el repo de Github.
```shell
git clone https://github.com/JHONATAN9A/Signals-Systems.git
```
**!Importante:** Para correr el proeycto debemos tener instalado `Python 3` y `pip` en el sistema.

2. Intalar las librerias requeridas para el proyecto. Para realizar este paso debes estar en la raíz del proyecto y luego ejecutar el comando: 

```shell
pip install -r requirements.txt
```

## Ejecución

1. En la raíz de proyecto ingresar a la carpeta `Python`.

```shell
cd Python
```
**!Importante:** Los siguientes pasos se deben ejecutar en simultaneo y en el presente orden. Se recomienda ejecutar cada comando en consola diferente. 

2. Inciar el servidor de imagenes.

```shell
python server_img.py
```

3. Inciar el servidor de la aplicación. 
```shell
python app.py
```

4. Copiar y pegar la url en el navegador de preferencia. 
```shell
http://127.0.0.1:8050/
```