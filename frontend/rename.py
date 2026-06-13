import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception:
        return

    if "Rosita" in content or "rosita" in content or "ROSITA" in content:
        content = content.replace("Rosita Content Studio", "Rosyta Content Studio")
        content = content.replace("Rosita", "Rosyta")
        content = content.replace("rosita", "rosyta")
        content = content.replace("ROSITA", "ROSYTA")
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

# Frontend
for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts", ".html", ".css", ".json")):
            replace_in_file(os.path.join(root, file))

replace_in_file("index.html")
replace_in_file("package.json")

# Backend (need to search up a directory)
backend_dir = "../backend"
for root, _, files in os.walk(backend_dir):
    if "venv" in root or "__pycache__" in root or "migrations" in root:
        continue
    for file in files:
        if file.endswith((".py", ".html", ".txt", ".json")):
            replace_in_file(os.path.join(root, file))
