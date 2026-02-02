def recommend_dress(gender, skin_tone):
    """
    Enhanced dress recommendations based on gender and skin tone
    Curated by fashion experts for optimal color matching
    """
    
    recommendations = {
        "Male": {
            "Light": [
                "White Linen Shirt",
                "Cream Kurta with Pastels",
                "Light Blue Dress Shirt",
                "Pale Yellow Formal Shirt"
            ],
            "Medium": [
                "Navy Blue Shirt",
                "Olive Green T-Shirt",
                "Burgundy Casual Shirt",
                "Charcoal Grey Kurta",
                "Forest Green Jacket"
            ],
            "Dark": [
                "Bright White T-Shirt",
                "Golden Yellow Kurta",
                "Electric Blue Shirt",
                "Vibrant Orange Casual Wear",
                "Cream-Colored Formal Shirt"
            ]
        },
        "Female": {
            "Light": [
                "Pastel Pink Saree",
                "Lavender Floral Kurti",
                "Cream Anarkali Dress",
                "Sky Blue Lehenga",
                "Peach Chiffon Saree",
                "Mint Green Dress"
            ],
            "Medium": [
                "Deep Emerald Green Kurti",
                "Maroon Traditional Saree",
                "Teal Blue Dress",
                "Rust Orange Lehenga",
                "Purple Ethnic Wear",
                "Coral Pink Anarkali"
            ],
            "Dark": [
                "Golden Silk Saree",
                "Bright Pink Lehenga",
                "Jewel Tone Purple Dress",
                "Vibrant Red Ethnic Wear",
                "Royal Blue Saree",
                "Mustard Yellow Kurti",
                "Turquoise Dress"
            ]
        }
    }
    
    # Validate inputs
    if gender not in recommendations:
        gender = "Female"  # Default
    if skin_tone not in recommendations[gender]:
        skin_tone = "Medium"  # Default
    
    dresses = recommendations[gender][skin_tone]
    
    # Return top 3 recommendations
    return dresses[:3]
