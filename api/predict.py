import joblib
import re
import numpy as np
from pathlib import Path

# Paths to artifacts
BASE_DIR = Path(__file__).parent.parent
MODEL_PATH = BASE_DIR / "model" / "artifacts" / "sentiment_model.pkl"
TFIDF_PATH = BASE_DIR / "model" / "artifacts" / "tfidf_vectorizer.pkl"
ENCODER_PATH = BASE_DIR / "model" / "artifacts" / "label_encoder.pkl"

# Load artifacts once at startup
model = joblib.load(MODEL_PATH)
tfidf = joblib.load(TFIDF_PATH)
encoder = joblib.load(ENCODER_PATH)

def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'#\w+', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    text = text.strip()
    return text

def predict_sentiment(text: str) -> dict:
    cleaned = clean_text(text)
    vectorized = tfidf.transform([cleaned])
    
    prediction = model.predict(vectorized)[0]
    sentiment = encoder.inverse_transform([prediction])[0]
    
    # Get confidence scores
    decision = model.decision_function(vectorized)[0]
    exp_scores = np.exp(decision - np.max(decision))
    probs = exp_scores / exp_scores.sum()
    
    prob_dict = {
        label: round(float(prob), 4)
        for label, prob in zip(encoder.classes_, probs)
    }
    
    confidence = round(float(np.max(probs)), 4)
    
    return {
        "text": text,
        "sentiment": sentiment,
        "confidence": confidence,
        "probabilities": prob_dict
    }