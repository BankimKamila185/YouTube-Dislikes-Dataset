from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import os

app = FastAPI(title="YouTube Risk Prediction API")

# Configure CORS for the frontend (Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for easy deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the models when the API starts
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'scaler.pkl')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

try:
    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading models: {e}")
    scaler = None
    model = None

class RiskRequest(BaseModel):
    view_count: float
    comment_count: float

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the YouTube Risk Analysis API!",
        "status": "Online",
        "model_loaded": scaler is not None and model is not None
    }

@app.post("/predict")
def predict_risk(request: RiskRequest):
    if not scaler or not model:
        raise HTTPException(status_code=500, detail="Model is not loaded properly on the server.")
        
    try:
        # Preprocess the input exactly as during training
        input_data = pd.DataFrame({
            'view_count': [request.view_count], 
            'comment_count': [request.comment_count]
        })
        input_log = np.log1p(input_data)
        input_scaled = scaler.transform(input_log)
        
        # Predict
        prediction_val = int(model.predict(input_scaled)[0])
        probability = float(model.predict_proba(input_scaled)[0][1])
        
        return {
            "prediction": "High Risk" if prediction_val == 1 else "Low Risk",
            "probability": probability,
            "prediction_code": prediction_val
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
