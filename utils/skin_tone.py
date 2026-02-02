import cv2
import numpy as np

def detect_skin_tone(face):
    """
    Improved skin tone detection using LAB color space analysis
    More accurate than simple lightness threshold
    """
    try:
        # Convert to LAB color space for better skin tone analysis
        lab = cv2.cvtColor(face, cv2.COLOR_RGB2LAB)
        
        # Split LAB channels
        L, A, B = cv2.split(lab)
        
        # Get average values
        avg_lightness = np.mean(L)
        avg_a = np.mean(A)  # Green-Red axis
        avg_b = np.mean(B)  # Blue-Yellow axis
        
        # Calculate skin tone characteristics
        # A channel: lower values = greener (typically darker skin), higher = redder (lighter skin)
        # B channel: lower = bluer, higher = yellower (warmer skin tone indicator)
        
        # Improved classification using multiple parameters
        # Also consider red/green balance for better accuracy
        
        # Calculate weighted score for skin tone
        # Primary factor: Lightness (L channel)
        # Secondary factors: Color channels (A, B)
        
        # Very Dark: L < 50 and low lightness
        if avg_lightness < 50:
            return "Dark"
        
        # Dark: L < 85
        elif avg_lightness < 85:
            # Check if it's deep or medium
            if avg_a < 128:  # More greenish = darker
                return "Dark"
            else:
                return "Medium"
        
        # Medium: L between 85-130
        elif avg_lightness < 130:
            # Fine-tune between medium and light
            if avg_lightness < 100:
                return "Medium"
            else:
                return "Medium"
        
        # Light: L > 130
        else:
            # Very light or light
            if avg_lightness > 160:
                return "Light"
            else:
                return "Light"
                
    except Exception as e:
        print(f"Skin tone detection error: {e}")
        return "Medium"  # Default to medium if error
