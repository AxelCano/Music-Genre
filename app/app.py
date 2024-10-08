from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Define where uploaded files will be stored temporarily
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to render the index.html template
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle the audio file and predict genre
@app.route('/predict', methods=['POST'])
def predict_genre():
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['audio_file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    predicted_genre = run_genre_prediction(file_path)

    os.remove(file_path)

    return jsonify({'genre': predicted_genre})

def run_genre_prediction(file_path):
    return "Pop"  # Dummy response for now

if __name__ == '__main__':
    app.run(debug=True)
