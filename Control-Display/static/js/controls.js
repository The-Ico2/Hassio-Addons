function toggleEntity(entity_id) {
  fetch("/api/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id })
  }).then(() => location.reload());
}

function setLightBrightness(entity_id, brightness) {
  fetch("/api/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "light",
      service: "turn_on",
      data: { entity_id, brightness: parseInt(brightness) }
    })
  });
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
  });
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
  });
}
