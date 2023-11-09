CREATE TABLE mq7.mq7_sensor01 (
    id SERIAL PRIMARY KEY,
    sensor VARCHAR(255),
    hora VARCHAR(20),
    fecha VARCHAR(20),
    valor DECIMAL(10, 2),
    usuario VARCHAR(255),
    codigo VARCHAR(10),
    prueba BOOLEAN
);

CREATE TABLE mq7.mq7_sensor02 (
    id SERIAL PRIMARY KEY,
    sensor VARCHAR(255),
    hora VARCHAR(20),
    fecha VARCHAR(20),
    valor DECIMAL(10, 2),
    usuario VARCHAR(255),
    codigo VARCHAR(10),
    prueba BOOLEAN
);

CREATE TABLE mq7.mq7_sensor03 (
    id SERIAL PRIMARY KEY,
    sensor VARCHAR(255),
    hora VARCHAR(20),
    fecha VARCHAR(20),
    valor DECIMAL(10, 2),
    usuario VARCHAR(255),
    codigo VARCHAR(10),
    prueba BOOLEAN
);