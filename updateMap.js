const url = "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
const markers = [];

async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 42.3601, lng: -71.0589 },
    zoom: 14,
  });
  return map;
}

async function load() {
  const locations = await getBusLocations();
  console.log(new Date());
  console.log(locations);

  locations.forEach(({ attributes }) => {
    const { latitude, longitude } = attributes;
    const latlng = new google.maps.LatLng(latitude, longitude);
    const marker = new google.maps.Marker({
      position: latlng,
      title: `Bus ${markers.length + 1}`,
      map,
    });
    markers.push(marker);
  });
}

async function getBusLocations() {
  try {
    const res = await fetch(url, {
      headers: { "x-api-key": "YOUR_API_KEY" },
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
  }
}

async function updateBusLocations() {
  const updatedLocations = await getBusLocations();
  updatedLocations.forEach(({ attributes }, i) => {
    const { latitude, longitude } = attributes;
    const latlng = new google.maps.LatLng(latitude, longitude);
    markers[i].setPosition(latlng);
  });
  setTimeout(updateBusLocations, 15000);
}

(async function () {
  const map = await initMap();
  await load();
  updateBusLocations();
})();
