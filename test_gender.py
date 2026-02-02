"""
Test script to verify gender prediction on local images
Run this to test the gender detector before uploading to frontend
"""
import cv2
import sys
sys.path.insert(0, './utils')
from gender_predictor import predict_gender
from face_detector import detect_face
from skin_tone import detect_skin_tone

def test_image(image_path):
    print(f"\n{'='*50}")
    print(f"Testing: {image_path}")
    print(f"{'='*50}")
    
    # Detect face
    face = detect_face(image_path)
    if face is None:
        print("❌ No face detected!")
        return
    
    # Predict gender
    gender = predict_gender(face)
    print(f"✓ Gender: {gender}")
    
    # Detect skin tone
    skin_tone = detect_skin_tone(face)
    print(f"✓ Skin Tone: {skin_tone}")

if __name__ == "__main__":
    # Test with any image path
    test_image("uploads/IMG_0135.JPG")  # Your male photo
