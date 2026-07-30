import subprocess
import sys
import os
import time

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("🚀 Starting Enterprise AI Finance Agent...")
    print(f"Backend directory: {backend_dir}")
    print(f"Frontend directory: {frontend_dir}")

    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"]
    frontend_cmd = "npm run dev"

    print("Starting FastAPI Backend on http://localhost:8000 ...")
    backend_process = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    print("Starting Vite Frontend on http://localhost:3003 ...")
    frontend_process = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping Finance Agent processes...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
