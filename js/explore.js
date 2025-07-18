  const map = L.map('map').setView([51.0282, 4.4777], 14);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let routingControl = null;
  let userMarker = null;
  let customMarker = null; // for user clicks
  let userLatLng = null;

  // Locations
  const locations = [
    { name: "Kazerne Dossin", coords: [51.0341, 4.4782] },
    { name: "Train Station", coords: [51.0167, 4.4807] },
    { name: "Vrijbroekpark", coords: [51.0198, 4.4647] }
  ];

  locations.forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map);

    const popupContent = `
      <b>${loc.name}</b><br/>
      <button class="navigate-btn" onclick="startNavigation(${loc.coords[0]}, ${loc.coords[1]})">
        Navigate
      </button>
    `;

    marker.bindPopup(popupContent);
  });

  // Pulsing marker for user
  const pulsingIcon = L.divIcon({
    className: '',
    html: '<div class="pulsing-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);

        if (!userMarker) {
          userMarker = L.marker(userLatLng, { icon: pulsingIcon }).addTo(map);
          map.setView(userLatLng, 14);
        } else {
          userMarker.setLatLng(userLatLng);
        }
      },
      (err) => {
        console.error("GPS error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    );
  } else {
    alert("Geolocation not supported.");
  }

  // ✅ CUSTOM LOCATION - click to add a marker
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    if (customMarker) {
      customMarker.setLatLng([lat, lng]);
    } else {
      customMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
    }

    customMarker.bindPopup(`Custom location:<br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`).openPopup();

    // You could store the coords to use later:
    console.log("Selected location:", lat, lng);
  });

  // NAVIGATION
  function startNavigation(destLat, destLng) {
    if (!userLatLng) {
      alert("Waiting for your location...");
      return;
    }

    const destination = L.latLng(destLat, destLng);

    if (routingControl) {
      map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
      waypoints: [userLatLng, destination],
      routeWhileDragging: false,
      show: false,
      collapsible: true
    }).addTo(map);

    document.getElementById("routeInstructions").style.display = "none";
    document.getElementById("routeInstructions").innerHTML = "";
    document.getElementById("stopNavBtn").style.display = "block";
  }

  function stopNavigation() {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
    document.getElementById("stopNavBtn").style.display = "none";
    document.getElementById("routeInstructions").style.display = "none";
  }

  window.startNavigation = startNavigation;
  window.stopNavigation = stopNavigation;


map.on('click', function (e) {
  const { lat, lng } = e.latlng;

  if (customMarker) {
    customMarker.setLatLng([lat, lng]);
  } else {
    customMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
  }

  const popupHtml = `
    <b>Custom Location</b><br>
    Lat: ${lat.toFixed(5)}<br>
    Lng: ${lng.toFixed(5)}<br>
    <button onclick="navigateToCustomLocation()" class="navigate-btn">Navigate Here</button>
  `;

  customMarker.bindPopup(popupHtml).openPopup();

  // Save coords if needed
  localStorage.setItem("customLat", lat);
  localStorage.setItem("customLng", lng);
});

function navigateToCustomLocation() {
  if (!customMarker) {
    alert("Select a custom location on the map first.");
    return;
  }

  const coords = customMarker.getLatLng();
  startNavigation(coords.lat, coords.lng);
}