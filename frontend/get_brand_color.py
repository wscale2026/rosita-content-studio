import sys
from PIL import Image
import colorsys

def get_brand_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        img.thumbnail((100, 100))
        
        colors = img.getcolors(100 * 100)
        
        # Sort by saturation and frequency
        def color_score(item):
            count, color = item
            r, g, b = color
            h, l, s = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
            # We want high saturation, high frequency, but not pure white/black
            # Filter out grays (saturation < 0.1 or lightness < 0.1 or lightness > 0.9)
            if s < 0.15 or l < 0.15 or l > 0.85:
                return -1
            return count * (s ** 2)

        valid_colors = [c for c in colors if color_score(c) > 0]
        valid_colors.sort(reverse=True, key=color_score)
        
        if valid_colors:
            dominant_color = valid_colors[0][1]
        else:
            # fallback
            colors.sort(reverse=True, key=lambda c: c[0])
            dominant_color = colors[0][1]
            
        r, g, b = dominant_color
        print(f"Brand RGB: rgb({r}, {g}, {b})")
        print(f"Brand HEX: #{r:02x}{g:02x}{b:02x}")
        
    except Exception as e:
        print(f"Error: {e}")

get_brand_color("/home/dumping/Documents/projet/Rosita-Content-Studio/frontend/public/images/logo.jpeg")
