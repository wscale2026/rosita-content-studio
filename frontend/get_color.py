import sys
from PIL import Image

def get_dominant_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        img.thumbnail((100, 100))  # Resize to speed up
        
        colors = img.getcolors(100 * 100)
        
        # Sort by frequency, descending
        colors.sort(reverse=True, key=lambda c: c[0])
        
        # Try to find the most dominant color that isn't white or black
        dominant_color = None
        for count, color in colors:
            r, g, b = color
            # Skip near-white
            if r > 240 and g > 240 and b > 240:
                continue
            # Skip near-black
            if r < 15 and g < 15 and b < 15:
                continue
            dominant_color = color
            break
            
        if not dominant_color and colors:
            dominant_color = colors[0][1] # fallback to the most common
            
        r, g, b = dominant_color
        # convert to HSL
        import colorsys
        h, l, s = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
        h, s, l = h*360, s*100, l*100
        print(f"RGB: rgb({r}, {g}, {b})")
        print(f"HEX: #{r:02x}{g:02x}{b:02x}")
        print(f"HSL: {h:.1f} {s:.1f}% {l:.1f}%")
        
    except Exception as e:
        print(f"Error: {e}")

get_dominant_color("/home/dumping/Documents/projet/Rosita-Content-Studio/frontend/public/images/logo.jpeg")
