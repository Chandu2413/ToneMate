import cv2
import numpy as np
import os

# Try to load pre-trained gender model
GENDER_MODEL = None
GENDER_PROTO = None

def load_gender_model():
    """Load pre-trained caffe gender classification model"""
    global GENDER_MODEL, GENDER_PROTO
    
    try:
        # Model files - try to load if available
        model_path = "models/gender_net.caffemodel"
        proto_path = "models/gender_deploy.prototxt"
        
        if os.path.exists(model_path) and os.path.exists(proto_path):
            GENDER_MODEL = cv2.dnn.readNetFromCaffe(proto_path, model_path)
            return True
    except:
        pass
    
    return False

def predict_gender_with_model(face):
    """Use pre-trained deep learning model if available"""
    try:
        if GENDER_MODEL is None:
            return None
            
        blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), 
                                     [78.4263377603, 87.7689143744, 114.895847746],
                                     swapRB=False)
        GENDER_MODEL.setInput(blob)
        gender_preds = GENDER_MODEL.forward()
        
        # Predictions come in order: Male, Female
        gender_idx = np.argmax(gender_preds[0])
        confidence = gender_preds[0][gender_idx]
        
        return "Male" if gender_idx == 0 else "Female", confidence
    except:
        return None

def predict_gender_heuristic(face):
    """
    Balanced gender prediction focusing on facial structure
    not skin tone or simple intensity metrics
    """
    try:
        gray = cv2.cvtColor(face, cv2.COLOR_RGB2GRAY)
        h, w = gray.shape
        
        # ===== FACE GEOMETRY & STRUCTURE (Most reliable) =====
        # Males: wider/square, Females: narrower/more oval
        aspect_ratio = w / h
        
        # ===== EYE REGION (Males have more prominent features) =====
        eyes_region = gray[int(h*0.2):int(h*0.4), :]
        eyes_std = np.std(eyes_region)
        eyes_mean = np.mean(eyes_region)
        
        # ===== MID FACE (cheeks, structure) =====
        midface = gray[int(h*0.35):int(h*0.6), int(w*0.15):int(w*0.85)]
        midface_std = np.std(midface)
        midface_mean = np.mean(midface)
        
        # ===== LOWER FACE (jaw/chin) =====
        lower_face = gray[int(h*0.6):h, int(w*0.15):int(w*0.85)]
        lower_mean = np.mean(lower_face)
        lower_std = np.std(lower_face)
        
        # ===== EDGE/FEATURE DENSITY =====
        # Use adaptive thresholds
        thresh_low = midface_mean * 0.6
        thresh_high = midface_mean * 1.4
        edges = cv2.Canny(gray, int(thresh_low), int(thresh_high))
        edge_density = np.sum(edges > 0) / (gray.size)
        
        # ===== GRADIENT ANALYSIS =====
        # Males have stronger gradients (sharper features)
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        magnitude = np.sqrt(grad_x**2 + grad_y**2)
        gradient_strength = np.mean(magnitude)
        
        # ===== OVERALL VARIANCE =====
        overall_var = np.var(gray)
        
        male_score = 0.0
        female_score = 0.0
        
        # Calculate relative darkness for lower face
        lower_relative = lower_mean - midface_mean
        
        # SCORE 1: Midface Smoothness (PRIMARY - 50%)
        # HIGH smoothness/variance = female (makeup, softer features)
        # LOW smoothness/variance = male (simpler structure)
        if midface_std > 55:
            female_score += 5.0
        elif midface_std > 45:
            female_score += 3.5
        elif midface_std > 35:
            female_score += 2.0
        elif midface_std < 25:
            male_score += 3.5
        elif midface_std < 32:
            male_score += 2.0
        
        # SCORE 2: Face Aspect Ratio (SECONDARY - 20%)
        # Male: ~0.75-0.80, Female: ~0.70-0.75
        if aspect_ratio > 0.77:
            male_score += 2.0
        elif aspect_ratio > 0.74:
            male_score += 1.0
        elif aspect_ratio < 0.70:
            female_score += 1.0
        
        # SCORE 3: Lower Face Darkness (TERTIARY - 20%)
        # Males: darker lower face (from facial hair)
        if lower_relative < -12:
            male_score += 2.5
        elif lower_relative < -5:
            male_score += 1.0
        elif lower_relative > 10:
            female_score += 1.5
        
        # SCORE 4: Gradient Strength (QUATERNARY - 10%)
        # Males: stronger gradients (sharper features)
        if gradient_strength > 45:
            male_score += 1.5
        elif gradient_strength > 30:
            male_score += 0.5
        elif gradient_strength < 20:
            female_score += 0.5
        
        # SCORE 5: Lower Face Texture (QUINARY - 5%)
        # Males: more textured
        if lower_std > 40:
            male_score += 1.0
        elif lower_std < 28:
            female_score += 1.0
        
        # Debug
        print(f"Gender Analysis:")
        print(f"  Aspect ratio: {aspect_ratio:.3f}")
        print(f"  Midface smoothness: {midface_std:.1f}")
        print(f"  Lower face darkness delta: {lower_relative:.1f}")
        print(f"  Lower face texture: {lower_std:.1f}")
        print(f"  Gradient strength: {gradient_strength:.1f}")
        print(f"  Edge density: {edge_density:.4f}")
        print(f"  Overall variance: {overall_var:.0f}")
        print(f"  SCORES -> Male: {male_score:.1f}, Female: {female_score:.1f}")
        
        # Decision
        if male_score > female_score + 1.0:
            return "Male"
        elif female_score > male_score + 1.0:
            return "Female"
        else:
            # Tie: use midface smoothness (inverted)
            return "Female" if midface_std > 40 else "Male"
            
    except Exception as e:
        print(f"Gender heuristic error: {e}")
        import traceback
        traceback.print_exc()
        return "Unknown"

def predict_gender(face):
    """
    Main gender prediction function
    Uses model if available, otherwise uses heuristic approach
    """
    try:
        # Try model-based prediction first
        result = predict_gender_with_model(face)
        if result is not None:
            print(f"Using model prediction: {result[0]}")
            return result[0]
        
        # Fall back to heuristic
        result = predict_gender_heuristic(face)
        print(f"Using heuristic prediction: {result}")
        return result
        
    except Exception as e:
        print(f"Gender prediction error: {e}")
        return "Unknown"

# Load model on startup
load_gender_model()
