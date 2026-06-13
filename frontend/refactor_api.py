import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the pattern and replace it
    pattern = "http://${window.location.hostname}:8000/api"
    if pattern in content:
        # Check if API_BASE_URL is imported
        if "API_BASE_URL" not in content and filepath != "src/lib/auth.ts":
            # We need to add the import.
            # Assuming most files are in src/pages or src/components
            if "src/pages" in filepath or "src/components" in filepath:
                import_stmt = "import { API_BASE_URL } from \"@/lib/auth\";\n"
            elif "src/frontoffice/src" in filepath:
                # LeadMagnet.tsx and CheckoutModal.tsx are inside frontoffice/src
                # which might not have the same @ alias or structure.
                # Let's just use import.meta.env directly there to be safe without breaking imports.
                pass
            
            if "src/frontoffice/src" not in filepath:
                # Add import after the last import
                lines = content.split('\n')
                last_import_idx = 0
                for i, line in enumerate(lines):
                    if line.startswith("import "):
                        last_import_idx = i
                lines.insert(last_import_idx + 1, import_stmt)
                content = '\n'.join(lines)

        if "src/frontoffice/src" in filepath:
            # Replace with import.meta.env
            content = content.replace("`http://${window.location.hostname}:8000/api", "`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`}")
        else:
            content = content.replace("`http://${window.location.hostname}:8000/api", "`${API_BASE_URL}")
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

# Update auth.ts first
auth_file = "src/lib/auth.ts"
with open(auth_file, 'r') as f:
    auth_content = f.read()
if "export const API_BASE_URL" not in auth_content:
    auth_content = auth_content.replace(
        "const API_URL = `http://${window.location.hostname}:8000/api/auth`;",
        "export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;\nconst API_URL = `${API_BASE_URL}/auth`;"
    )
    with open(auth_file, 'w') as f:
        f.write(auth_content)
    print("Updated auth.ts")

# Find all tsx and ts files
for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(root, file)
            if filepath != "src/lib/auth.ts":
                replace_in_file(filepath)
