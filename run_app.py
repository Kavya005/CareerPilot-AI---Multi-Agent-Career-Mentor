import os
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT / "frontend"


def run_command(command, cwd=None, env=None):
    return subprocess.Popen(command, cwd=cwd, env=env, shell=True)


if __name__ == "__main__":
    env = os.environ.copy()
    env.setdefault("PYTHONPATH", str(ROOT / "src"))

    for port in [8000, 5173, 5174]:
        try:
            subprocess.run(
                ["powershell", "-Command", f"$p = Get-NetTCPConnection -LocalPort {port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1; if ($p) {{ Stop-Process -Id $p -Force }}"],
                check=False,
                capture_output=True,
            )
        except Exception:
            pass

    backend = run_command(r'.venv\\Scripts\\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8000', cwd=ROOT, env=env)
    time.sleep(2)
    frontend = run_command(r'npm run dev -- --host 0.0.0.0 --port 5173', cwd=FRONTEND_DIR, env=env)

    print("Backend and frontend started.")
    print("Backend: http://127.0.0.1:8000")
    print("Frontend: http://localhost:5173")
    print("Press Ctrl+C to stop both processes.")

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        backend.terminate()
        frontend.terminate()
