from flask import Flask, send_from_directory
import os

app = Flask(__name__)

image_folder = os.path.join(os.getcwd(), 'static', 'images')

@app.route('/images/<image_filename>')  
def serve_image(image_filename):
    return send_from_directory(image_folder, image_filename, mimetype='image/png') 

if __name__ == '__main__':
    app.run(debug=True)

