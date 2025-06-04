# === Imports ===
import os, sys, requests
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from module.state_cache import get_cached_state, call_service, start_cache_updater
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Use logger.info(), logger.error(), etc., throughout your code

start_cache_updater()


# === Environment Configuration ===
load_dotenv()

# Generate or load Fernet key
KEY = os.getenv('FLASK_SECRET_KEY')
HASS_TOKEN = os.getenv("SUPERVISOR_TOKEN")
HASS_API = os.getenv("HASS_API", "http://host.docker.internal:8123/api")
if not HASS_TOKEN:
    print("⚠️  Missing Home Assistant token. Please set the SUPERVISOR_TOKEN environment variable.")
    sys.exit(1)

if not KEY:
    print("⚠️  Missing environment variables. Generating new key(s)...")
    with open('.env', 'w') as f:
        f.write(f'FLASK_SECRET_KEY={Fernet.generate_key().decode()}\n')
SECRET_KEY = KEY

# Reload the key after setting them

# === Database Initialization ===
# Not known whether or not a database is needed for this app

# === Custom Decorator ===
# No Custom Decorators Yet

# === Flask App Initialization ===
app = Flask(__name__)
app.secret_key = SECRET_KEY


def get_rooms_from_home_assistant():
    headers = {"Authorization": f"Bearer {HASS_TOKEN}"}
    try:
        res = requests.get(f"{HASS_API}/lovelace/config", headers=headers)
        if res.status_code == 200:
            views = res.json().get("views", [])
            return [{"title": v.get("title"), "path": v.get("path", v.get("title").lower())} for v in views]
    except Exception as e:
        print(f"Error fetching HA views: {e}")
    return []

def get_entities_by_room(domain_prefix, room):
    state = get_cached_state()
    results = []
    for entity_id, data in state.items():
        if not entity_id.startswith(f"{domain_prefix}."):
            continue
        attrs = data.get("attributes", {})
        area = attrs.get("area_id") or attrs.get("friendly_name", "").lower()
        if room == "all" or room in area:
            results.append({
                "entity_id": entity_id,
                "name": attrs.get("friendly_name", entity_id),
                "state": data.get("state"),
            })
    return results



# === API Endpoints ===
@app.route('/api/room', methods=['GET', 'POST'])
def room_selector():
    rooms = get_rooms_from_home_assistant()
    next_page = request.args.get('next', '')

    if request.method == 'POST':
        selected_room = request.form.get('room')
        session['selected_room'] = selected_room
        if next_page == 'lights':
            return redirect(url_for('lights_page'))
        elif next_page == 'climate':
            return redirect(url_for('climate_page'))
        return redirect(url_for('home'))

    return render_template('room.html', rooms=rooms, next_page=next_page)

@app.route('/api/toggle', methods=['POST'])
def toggle_entity():
    entity_id = request.json.get("entity_id")
    if not entity_id:
        return jsonify({"success": False, "error": "No entity_id"}), 400

    domain = entity_id.split(".")[0]
    success = call_service(domain, "toggle", {"entity_id": entity_id})
    return jsonify({"success": success})


# === Static File Handlers ===
def get_css_files():
    """Return list of CSS files from static/css/ directory."""
    css_dir = os.path.join(app.static_folder, 'css')
    return [f'css/{f}' for f in os.listdir(css_dir) if f.endswith('.css')]

def get_js_files():
    """Return list of JS files from static/js/ directory."""
    js_dir = os.path.join(app.static_folder, 'js')
    return [f'js/{f}' for f in os.listdir(js_dir) if f.endswith('.js')]



# === Jinja2 Global Functions ===
app.jinja_env.globals.update(get_css_files=get_css_files)
app.jinja_env.globals.update(get_js_files=get_js_files)


# === Context Processors ===
# No Context Processors Yet


# === Page Routes ===
@app.route('/')
def home():
    return render_template('dashboard.html', val1="active")

@app.route('/lights')
def lights_redirect():
    return redirect(url_for('room_selector', next='lights'))

@app.route('/climate')
def climate_redirect():
    return redirect(url_for('room_selector', next='climate'))

@app.route('/lights/page')
def lights_page():
    room = session.get('selected_room', 'all')
    lights = get_entities_by_room("light", room)
    return render_template('lights.html', room=room, lights=lights, val2='active')

@app.route('/climate/page')
def climate_page():
    room = session.get('selected_room', 'all')
    climates = get_entities_by_room("climate", room)
    return render_template('climate.html', room=room, climates=climates, val3='active')

@app.route('/debug/cache')
def debug_cache():
    return jsonify(get_cached_state())

@app.route('/config', methods=['GET', 'POST'])
def config():
    if request.method == 'POST':
        new_url = request.form.get('ha_url')
        new_interval = request.form.get('poll_interval')
        # Save to a config file
        with open('config.ini', 'w') as f:
            f.write(f'HA_URL={new_url}\nPOLL_INTERVAL={new_interval}\n')
        return redirect(url_for('home'))
    
    return render_template('config.html')

# === Error Handlers ===
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


# === Entry Point ===
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)