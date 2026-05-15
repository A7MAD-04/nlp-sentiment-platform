from pydantic import BaseModel

class TextInput(BaseModel):
    text: str

class PredictionOutput(BaseModel):
    text: str
    sentiment: str
    confidence: float
    probabilities: dict