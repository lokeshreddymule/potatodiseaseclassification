from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
import os

# ================== APP SETUP ==================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== MODEL CONFIG ==================
# ✅ EXACTLY the three required outputs
CLASS_NAMES = ["Healthy", "Early Blight", "Late Blight"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "potatoes.h5")

model = None


def load_model():
    global model
    if model is None:
        print("🔹 Loading model...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully.")
    return model


# ================== IMAGE PREPROCESSING ==================
def preprocess_image(image_bytes):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize((256, 256))          # MUST match training
    img = np.array(img).astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


# ================== API ROUTES ==================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    model = load_model()

    image_bytes = await file.read()
    img = preprocess_image(image_bytes)

    preds = model.predict(img)[0]
    print("Predictions:", preds)  # debug (optional)

    pred_idx = int(np.argmax(preds))

    return {
        "class": CLASS_NAMES[pred_idx],
        "confidence": float(preds[pred_idx])
    }


@app.get("/")
def home():
    return {"message": "Potato Disease Classification API is running"}
