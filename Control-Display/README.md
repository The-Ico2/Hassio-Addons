# Hassio-Addons/Control-Display

Control Display is a Flask-based touchscreen control panel add-on for Home Assistant. It provides a user-friendly interface to monitor and control Home Assistant devices such as lights, climate units, and toggles. The add-on supports offline caching, customizable settings, and audio feedback for user interactions.

---

## Features

- **Multi-device support:** Control lights, climate devices, and toggles with dedicated UI controls.
- **Room-based navigation:** Filter and control devices by room.
- **Offline caching:** Service worker caches key static files to enable offline use.
- **Sound feedback:** Audio cues for user actions (clicks, alerts, notifications).
- **Configurable polling:** Background caching of Home Assistant states for faster UI response.
- **Simple and elegant UI:** Responsive design with a dark background and icon navigation.
- **Easy installation:** Runs as a Home Assistant add-on container with host networking.

---

## Requirements

- Home Assistant instance (with API access enabled)
- Supervisor token with access to Home Assistant API
- Docker (if running outside Hass.io)
- Python 3.8+

---

## Installation

### Home Assistant Add-on

1. Copy or clone this repository into your `addons` folder in Home Assistant.
2. Ensure your `config.yaml` has the correct environment variables:
   - `HA_URL`: Your Home Assistant API URL (e.g., `http://homeassistant.local:8123`)
   - `HA_TOKEN`: Long-lived access token from your Home Assistant user.
3. Install the add-on from Supervisor → Add-on Store → Load from repository.
4. Start the add-on and open the web UI (default port 5000).

### Manual Docker

Alternatively, build and run the container manually:

```bash
docker build -t control_display .
docker run -d --network host -e HA_URL="http://your-ha:8123" -e HA_TOKEN="your_token" -p 5000:5000 control_display
```

## Folder Hierarchy

```bash
/ (project root)
│
├── app/
│   ├── config.yaml
│   ├── run.sh
│
├── modules/
│   ├── __init__.py
│   ├── __pycache__/
│   ├── state_cache.py
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── controls.js
│   │   ├── main.js
│   │   └── sw.js
│   ├── media/
│       ├── images/
│       │   ├── bg.jpg
│       │   └── icon/
│       │       ├── climate.png
│       │       ├── home.png
│       │       ├── lights.png
│       │       └── settings.png
│       └── sounds/
│           ├── alert.mp3
│           ├── click.mp3
│           ├── error.mp3
│           ├── notification.mp3
│           └── ping.mp3
│
├── templates/
│   ├── partials/
│   │   ├── climate_control.html
│   │   ├── light_control.html
│   │   └── toggle_control.html
│   ├── base.html
│   ├── settings.html
│   ├── room.html
│   ├── lights.html
│   ├── dashboard.html
│   ├── config.html
│   └── climate.html
│
├── logs/
│
├── .venv/
│
├── README.md
├── start.py
├── requirements.txt
├── Dockerfile
```
