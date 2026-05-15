from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schema import TextInput, PredictionOutput
from predict import predict_sentiment

app = FastAPI(
    title="NLP Sentiment Analysis API",
    description="Predict sentiment of airline tweets — negative, neutral, or positive",
    version="1.0.0"
)

# Allow frontend to talk to API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NLP Sentiment API is running ✅"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionOutput)
def predict(input: TextInput):
    result = predict_sentiment(input.text)
    return result