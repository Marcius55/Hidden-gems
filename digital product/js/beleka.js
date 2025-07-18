const map = L.map('map').setView([51.0206567, 4.4600776], 13);

// Base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Destination marker with popup
const destination = L.latLng(51.0206567, 4.4600776);
const marker = L.marker(destination)

  .addTo(map)
  .bindPopup('<button onclick="startNavigation()">Go</button>');

// Function to handle routing
function startNavigation() {
  const start = L.latLng(51.51, -0.12); // You can get this from geolocation later

  L.Routing.control({
    waypoints: [start, destination],
    routeWhileDragging: false,
    show: false
  }).addTo(map);
}

navigator.geolocation.getCurrentPosition(pos => {
  const start = L.latLng(pos.coords.latitude, pos.coords.longitude);
  L.Routing.control({
    waypoints: [start, destination]
  }).addTo(map);
});

// Example: Add more destination markers
const locations = [
  {
    name: "Art Alley",
    coords: [51.0206567, 4.4600776]
  },
  {
    name: "Hilltop Park",
    coords: [51.025, 4.465]
  },
  {
    name: "Sea View",
    coords: [51.018, 4.470]
  }
];

locations.forEach(loc => {
  L.marker(loc.coords)
    .addTo(map)
    .bindPopup(`<b>${loc.name}</b><br><button onclick="startNavigationTo(${loc.coords[0]}, ${loc.coords[1]})">Go</button>`);
});

// Update navigation function to accept destination
function startNavigationTo(lat, lng) {
  const destination = L.latLng(lat, lng);
  navigator.geolocation.getCurrentPosition(pos => {
    const start = L.latLng(pos.coords.latitude, pos.coords.longitude);
    L.Routing.control({
      waypoints: [start, destination],
      routeWhileDragging: false,
      show: false
    }).addTo(map);
  });
}
