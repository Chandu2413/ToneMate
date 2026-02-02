#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test improved gender prediction on both male and female photos
"""
import sys
sys.path.insert(0, '.')
from utils.gender_predictor import predict_gender
from utils.face_detector import detect_face

# Test images - UPDATE THESE BASED ON ACTUAL IMAGE CONTENT
test_images = [
    ("uploads/DSC_0135.JPG", "Test Image 1"),
    ("uploads/20260127_000123_puuta1.jpg", "Test Image 2"),
]

for image_path, label in test_images:
    print(f"\n{'='*60}")
    print(f"Testing: {label} - {image_path}")
    print(f"{'='*60}")
    
    try:
        face = detect_face(image_path)
        if face is not None:
            gender = predict_gender(face)
            print(f"\nPREDICTED GENDER: {gender}\n")
        else:
            print(f"No face detected in {image_path}")
    except Exception as e:
        print(f"Error: {e}")

print(f"{'='*60}")
print("Please verify: Are these results correct?")
print("If not, tell me which image should be Male and which Female")
