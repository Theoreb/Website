from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/<path:filename>')
def serve_file(filename):
    directory = '/home/theodore/Desktop/Website/'
    return send_from_directory(directory, filename)

if __name__ == '__main__':
    app.run()