import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, redirect, request, url_for
from functools import wraps

from api import save_regitro_co, get_last_registro_co, get_matriz_registro_co


app = Flask(__name__)

# Token válido
valid_token = os.environ.get('TOKEN')
DEBUG = bool(os.environ.get('ENV')) 

# Validar Token
def validate_sesion(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')

        if token != valid_token:
            return redirect(url_for('login'))
        return f(*args, **kwargs)

    return decorated


# Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        token = request.form['token']

        if token == valid_token:
            response = redirect(url_for('home'))
            response.set_cookie('token', token)
            return response
        else:
            return render_template('login.html', error='Invalid token')

    return render_template('login.html', error='')



@app.route('/regitro_co', methods=['POST'])
def save_data():
    return save_regitro_co()


@app.route('/get_registro_co', methods=['GET'])
def get_last_data():
    return get_last_registro_co()


@app.route('/get_matriz_co', methods=['GET'])
def get_matriz_co():
    return get_matriz_registro_co()


@app.route('/home')
@validate_sesion
def home():
    return render_template('index.html')



print(DEBUG)
if __name__ == '__main__':
    if DEBUG == True:
        app.run(debug=True)
    else:
        app.run(debug=False)