import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
from flask import request, jsonify
from datetime import time


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


def save_regitro_co():
    token = request.headers.get('Authorization')

    if token != f'Bearer {valid_token}':
        return jsonify({'message': 'Token inválido'}), 401

    data = request.get_json()

    if not data or not all(key in data for key in ['sensor', 'hora', 'fecha', 'valor', 'usuario', 'codigo', 'prueba']):
        return jsonify({'message': 'Datos no proporcionados o incompletos'}), 400

    try:
        with get_db_connection() as conn, conn.cursor() as cursor:
            cursor.execute("INSERT INTO mq7.registros (sensor, hora, fecha, valor, usuario, codigo, prueba) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                           (data['sensor'], data['hora'], data['fecha'], data['valor'], data['usuario'], data['codigo'], data['prueba']))
            conn.commit()
            return jsonify({'message': 'Datos guardados exitosamente'}), 201
    except Exception as e:
        return jsonify({'message': 'Error al guardar datos', 'error': str(e)}), 500
    

def get_last_registro_co():
    token = request.headers.get('Authorization')

    if token != f'Bearer {valid_token}':
        return jsonify({'message': 'Token inválido'}), 401

    try:
        with get_db_connection() as conn, conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mq7.registros ORDER BY id DESC LIMIT 1")
            record = cursor.fetchone()

            if record:
                id_regitro = record[0]
                sensor = record[1]
                hora = record[2].strftime('%H:%M:%S') if record[2] is not None else None
                fecha = record[3].strftime('%Y-%m-%d') if record[3] is not None else None
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