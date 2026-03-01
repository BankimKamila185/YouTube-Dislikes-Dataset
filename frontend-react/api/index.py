from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Load models safely
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'artifacts', 'model.pkl')
scaler_path = os.path.join(base_dir, 'artifacts', 'scaler.pkl')

try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    feature_names = ['view_count', 'likes', 'comments', 'engagement_rate', 'like_to_view_ratio', 'comment_to_view_ratio', 'published_month', 'tags_count']
except Exception as e:
    model = None
    scaler = None
    feature_names = None
    print(f"Server Startup Error - Failed to load models: {e}")

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Prediction models failed to load on the server.'}), 500

    try:
        data = request.json
        views = data.get('views', 0)
        likes = data.get('likes', 0)
        comments = data.get('comments', 0)
        
        # Feature Engineering equivalent to training
        engagement_rate = (likes + comments) / max(views, 1)
        like_to_view_ratio = likes / max(views, 1)
        comment_to_view_ratio = comments / max(views, 1)
        
        input_data = {
            'view_count': views,
            'likes': likes,
            'comments': comments,
            'engagement_rate': engagement_rate,
            'like_to_view_ratio': like_to_view_ratio,
            'comment_to_view_ratio': comment_to_view_ratio,
            'published_month': 6, # Default
            'tags_count': 10 # Default
        }
        
        df = pd.DataFrame([input_data])
        # Reorder to match scaler correctly
        df = df[feature_names]
        
        scaled_input = scaler.transform(df)
        probability = model.predict_proba(scaled_input)[0][1]
        prediction = int(probability > 0.5)

        return jsonify({
            'probability': float(probability),
            'prediction': prediction,
            'risk_level': 'High' if probability > 0.6 else 'Low' if probability < 0.3 else 'Moderate'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Provide a root response for vercel health checks
@app.route('/api', methods=['GET'])
def index():
    return jsonify({"status": "API is online"})

if __name__ == '__main__':
    app.run(debug=True, port=5328)
