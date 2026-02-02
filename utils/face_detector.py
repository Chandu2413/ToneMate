import cv2
from mtcnn import MTCNN

detector = MTCNN()

def detect_face(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return None

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    faces = detector.detect_faces(rgb_image)

    if not faces:
        return None

    x, y, w, h = faces[0]["box"]
    face = rgb_image[y:y+h, x:x+w]
    return face
