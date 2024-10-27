from flask import Flask, send_file
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    # Run the Snake game using subprocess
    subprocess.Popen(["python", "snake.py"])
    image_path="back5.jpeg"
    return send_file(image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
