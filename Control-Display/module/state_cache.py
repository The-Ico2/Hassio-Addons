import time
import threading
import requests
import os

HASS_TOKEN = os.getenv("SUPERVISOR_TOKEN")
HASS_API = "http://host.docker.internal:8123/api"
HEADERS = {"Authorization": f"Bearer {HASS_TOKEN}"}

_state_cache = {}
_last_update = 0
_update_interval = 10  # seconds

def _update_cache():
    global _state_cache, _last_update
    try:
        res = requests.get(f"{HASS_API}/states", headers=HEADERS)
        if res.status_code == 200:
            _state_cache = {e['entity_id']: e for e in res.json()}
            _last_update = time.time()
    except Exception as e:
        print("Error updating HA state cache:", e)

def get_cached_state():
    global _last_update
    if time.time() - _last_update > _update_interval:
        _update_cache()
    return _state_cache

# Background refresh thread (optional)
def start_cache_updater():
    def run():
        while True:
            _update_cache()
            time.sleep(_update_interval)
    threading.Thread(target=run, daemon=True).start()

def call_service(domain, service, data):
    headers = {"Authorization": f"Bearer {HASS_TOKEN}", "Content-Type": "application/json"}
    try:
        res = requests.post(f"{HASS_API}/services/{domain}/{service}", headers=headers, json=data)
        return res.status_code == 200
    except Exception as e:
        print(f"Service call failed: {e}")
        return False