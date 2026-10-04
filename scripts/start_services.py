#!/usr/bin/env python3
import json
import os
import signal
import subprocess
import sys
import time
import urllib.request

STATE_FILE = "/tmp/ce50_dev.json"
ROOT_DIR = "/root/ce50_v2"
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
PYTHON_BIN = os.path.join(ROOT_DIR, ".venv", "bin", "python")

BACKEND_LOG = "/tmp/ce50_backend.log"
FRONTEND_LOG = "/tmp/ce50_frontend.log"

def is_pid_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
        return True
    except (OSError, ProcessLookupError):
        return False

def check_http(url: str, timeout: float = 2.0) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "HealthCheck"})
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return res.status in (200, 304)
    except Exception:
        return False

def stop_services():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                data = json.load(f)
            for name, pid in data.items():
                if pid and is_pid_alive(pid):
                    try:
                        os.kill(pid, signal.SIGTERM)
                    except Exception:
                        pass
        except Exception:
            pass
        try:
            os.remove(STATE_FILE)
        except OSError:
            pass

    # Clean up uvicorn and nextjs on target ports
    subprocess.run(["pkill", "-f", "uvicorn main:app.*8001"], capture_output=True)
    subprocess.run(["pkill", "-f", "next.*dev.*3000"], capture_output=True)
    time.sleep(1)

def start_services():
    stop_services()

    # Start Backend
    b_out = open(BACKEND_LOG, "w")
    b_proc = subprocess.Popen(
        [
            PYTHON_BIN,
            "-m",
            "uvicorn",
            "main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8001",
        ],
        cwd=BACKEND_DIR,
        stdout=b_out,
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )

    # Start Frontend
    f_out = open(FRONTEND_LOG, "w")
    f_proc = subprocess.Popen(
        ["npm", "run", "dev", "--", "-H", "127.0.0.1", "-p", "3000"],
        cwd=FRONTEND_DIR,
        stdout=f_out,
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )

    pids = {"backend": b_proc.pid, "frontend": f_proc.pid}
    with open(STATE_FILE, "w") as f:
        json.dump(pids, f)

    # Health check wait
    start_time = time.time()
    backend_up = False
    frontend_up = False

    while time.time() - start_time < 30:
        if not backend_up and check_http("http://127.0.0.1:8001/news"):
            backend_up = True
        if not frontend_up and check_http("http://127.0.0.1:3000/"):
            frontend_up = True
        if backend_up and frontend_up:
            break
        time.sleep(0.5)

    print(f"Backend (8001): {'UP' if backend_up else 'FAILED'}")
    print(f"Frontend (3000): {'UP' if frontend_up else 'FAILED'}")
    return backend_up and frontend_up

def status():
    backend_up = check_http("http://127.0.0.1:8001/news")
    frontend_up = check_http("http://127.0.0.1:3000/")
    print(f"Backend (8001): {'UP' if backend_up else 'DOWN'}")
    print(f"Frontend (3000): {'UP' if frontend_up else 'DOWN'}")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "start":
        ok = start_services()
        sys.exit(0 if ok else 1)
    elif cmd == "stop":
        stop_services()
        print("Services stopped.")
    elif cmd == "status":
        status()
    elif cmd == "restart":
        ok = start_services()
        sys.exit(0 if ok else 1)
    else:
        print("Usage: python start_services.py [start|stop|restart|status]")
