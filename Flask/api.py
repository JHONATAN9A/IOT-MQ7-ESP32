import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
from flask import request, jsonify
from datetime import time
import pandas as pd



# Token válido
valid_token = os.environ.get('TOKEN')


# Conexión a la base de datos PostgreSQL
def get_db_connection():
    connection = psycopg2.connect(
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT'),
        database=os.environ.get('DB_NAME')
    )
    return connection

# Guardar registro en la base de datos PostgreSQL
def save_regitro_co():
    token = request.headers.get('Authorization')

    if token != f'Bearer {valid_token}':
        return jsonify({'message': 'Token inválido'}), 401

    data = request.get_json()

    if not data or not all(key in data for key in ['sensor', 'hora', 'fecha', 'valor', 'usuario', 'codigo', 'prueba']):
        return jsonify({'message': 'Datos no proporcionados o incompletos'}), 400

    try:
        with get_db_connection() as conn, conn.cursor() as cursor:
            cursor.execute("INSERT INTO mq7."+data['sensor']+"(sensor, hora, fecha, valor, usuario, codigo, prueba) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                           (data['sensor'], data['hora'], data['fecha'], data['valor'], data['usuario'], data['codigo'], data['prueba']))
            conn.commit()
            return jsonify({'message': 'Datos guardados exitosamente'}), 201
    except Exception as e:
        return jsonify({'message': 'Error al guardar datos', 'error': str(e)}), 500
    

# Obtner el ultimo registro de CO almacenado
def get_last_registro_co():
    token = request.headers.get('Authorization')

    if token != f'Bearer {valid_token}':
        return jsonify({'message': 'Token inválido'}), 401

    sensor = request.args.get('sensor')

    try:
        with get_db_connection() as conn, conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mq7."+sensor+" ORDER BY id DESC LIMIT 1")
            record = cursor.fetchone()

            if record:
                
                id_regitro = record[0]
                sensor = record[1]
                hora = record[2]
                fecha = record[3]
                valor = float(record[4])
                usuario = record[5]
                codigo = record[6]
                prueba = record[7]

                response = {
                    'id': id_regitro,
                    'sensor': sensor,
                    'hora': hora,
                    'fecha': fecha,
                    'valor': valor,
                    'usuario': usuario,
                    'codigo': codigo,
                    'prueba': prueba
                }
                return jsonify(response), 200
            else:
                return jsonify({'message': 'No se encontraron registros'}), 404
    except Exception as e:
        return jsonify({'message': 'Error al obtener el último registro', 'error': str(e)}), 500


semana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
sensores = ["MQ1", "MQ2", "MQ3"]
matriz_sensores = {}
# Obtener el total de registros de una semana
def get_matriz_registro_co():
    token = request.headers.get('Authorization')

    if token != f'Bearer {valid_token}':
        return jsonify({'message': 'Token inválido'}), 401

    try:
        with get_db_connection() as conn, conn.cursor() as cursor:
            for index, mq in enumerate(sensores):
                cursor.execute("SELECT * FROM  mq7.mq7_sensor0"+str(index+1)+" WHERE prueba = false;")
                records = cursor.fetchall()

                if records:
                    # Crear un DataFrame con los registros
                    columns = [desc[0] for desc in cursor.description]
                    df = pd.DataFrame(records, columns=columns)

                    dia_semana_inicio = 6

                    for i in range(0, 5):
                        dia_semana = '0' + str(dia_semana_inicio) if dia_semana_inicio < 10 else str(dia_semana_inicio)
                        df_filtrado = df[df['fecha'] == '2023-11-'+dia_semana]
                        df_filtrado['fecha_hora'] = pd.to_datetime(df_filtrado['fecha'] + ' ' + df_filtrado['hora'])
                        df_agrupado = df_filtrado.groupby(pd.Grouper(key='fecha_hora', freq='H')).agg({'valor': 'mean', 'codigo': 'first', 'prueba': 'first'})
                        list_data = df_agrupado['valor'].agg(list)
                        matriz_sensores[semana[i]+mq] = list_data
                        dia_semana_inicio+=1
                        
                    
                else:
                    return jsonify({'message': 'No se encontraron registros'}), 404
            
            return jsonify({'message': 'Ok', 'data': matriz_sensores}), 200

    except Exception as e:
        return jsonify({'message': 'Error al obtener los registros', 'error': str(e)}), 500