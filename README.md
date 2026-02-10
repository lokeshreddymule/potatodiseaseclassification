# Potato Disease Classification 🌱🥔

This project is a **full-stack machine learning application** that detects **potato leaf diseases** using a **CNN model**.  
It classifies an uploaded leaf image into one of three categories:
- Healthy
- Early Blight
- Late Blight

The system uses a **React frontend**, **FastAPI backend**, and a **TensorFlow model**.

---

## 🔍 Problem Statement

Potato crops are highly affected by leaf diseases such as Early Blight and Late Blight.  
Manual inspection is time-consuming and error-prone.  
This project aims to **automatically detect potato diseases from leaf images** using deep learning.

---

## 🎯 Features

- Upload potato leaf images
- Classifies leaf as:
  - Healthy
  - Early Blight
  - Late Blight
- Shows prediction confidence
- FastAPI REST API
- React-based user interface
- CPU-based inference (no GPU required)

---

## 🧠 Model Details

- Model type: **Convolutional Neural Network (CNN)**
- Framework: **TensorFlow / Keras**
- Input size: `256 × 256`
- Output: Softmax probabilities for 3 classes

---

## 🗂️ Project Structure
potatodiseaseclassification/
├── api/
│ └── main.py # FastAPI backend
├── frontend/ # React frontend
├── potatoes.h5 # Trained CNN model
├── requirements.txt
└── README.md


---

## 🚀 How to Run the Project

### 1️⃣ Backend Setup

bash
conda create -n potato_tf python=3.9 -y
conda activate potato_tf
pip install -r requirements.txt
cd api
uvicorn main:app --reload


http://127.0.0.1:8000
http://127.0.0.1:8000/docs



2️⃣ Frontend Setup

###   cd frontend
npm install
npm start


http://localhost:3000



{
  "class": "Healthy",
  "confidence": 0.93
}







