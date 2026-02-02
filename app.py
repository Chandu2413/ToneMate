from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from datetime import datetime

from utils.face_detector import detect_face
from utils.gender_predictor import predict_gender
from utils.skin_tone import detect_skin_tone
from utils.dress_recommender import recommend_dress

app = FastAPI(title="ToneMate AI Module")

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
async def status():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "ToneMate AI Module",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        os.makedirs("uploads", exist_ok=True)
        
        # Create unique filename to avoid conflicts
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        image_path = f"uploads/{filename}"

        # Save uploaded file
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Detect face
        face = detect_face(image_path)
        if face is None:
            return {
                "error": "No face detected in the image. Please upload a clear photo with your face visible.",
                "success": False
            }

        # Predict gender
        gender = predict_gender(face)
        print(f"✓ Gender Predicted: {gender}")
        
        # Detect skin tone
        skin_tone = detect_skin_tone(face)
        print(f"✓ Skin Tone Detected: {skin_tone}")
        
        # Get dress recommendations
        dresses = recommend_dress(gender, skin_tone)
        print(f"✓ Recommendations: {dresses}")

        # Return comprehensive results
        return {
            "success": True,
            "gender": gender,
            "skin_tone": skin_tone,
            "recommended_dresses": dresses,
            "analysis_details": {
                "face_detected": True,
                "confidence": "High",
                "timestamp": datetime.now().isoformat(),
                "recommendations_count": len(dresses)
            }
        }
        
    except Exception as e:
        return {
            "error": f"Analysis failed: {str(e)}",
            "success": False
        }
