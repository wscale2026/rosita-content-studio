import requests
import time

url = "http://localhost:8000/api/dashboard/stats/"

# First request to warm up
try:
    requests.get(url, timeout=5)
except Exception:
    pass

start = time.time()
try:
    response = requests.get(url, timeout=10)
    elapsed = time.time() - start
    print(f"Dashboard Stats Status: {response.status_code}")
    print(f"Time taken: {elapsed:.2f} seconds")
except Exception as e:
    print(f"Error: {e}")
