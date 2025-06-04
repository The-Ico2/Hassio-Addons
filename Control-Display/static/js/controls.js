function toggleEntity(entity_id) {
  fetch("/api/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id })
  })
  .then(response => {
    if (!response.ok) throw new Error("Toggle failed");
    location.reload();
  })
  .catch(err => {
    console.error(err);
    alert("Failed to toggle entity.");
  });
}


function setLight(entity_id, brightness, color) {
  const data = { entity_id };
  if (brightness !== undefined && brightness !== null) {
    data.brightness = parseInt(brightness);
  }
  if (color && typeof color === "object") {
    // Assume color is an object like { r: 255, g: 255, b: 255 }
    data.rgb_color = [color.r, color.g, color.b];
  }
  fetch("/api/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "light",
      service: "turn_on",
      data
    })
  }).then(() => location.reload());
}


function setClimateTemp(entity_id, temperature) {
  fetch("/api/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "climate",
      service: "set_temperature",
      data: { entity_id, temperature: parseFloat(temperature) }
    })
  }).then(() => location.reload());
}

function setClimateMode(entity_id, hvac_mode) {
  fetch("/api/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "climate",
      service: "set_hvac_mode",
      data: { entity_id, hvac_mode }
    })
  }).then(() => location.reload());
}