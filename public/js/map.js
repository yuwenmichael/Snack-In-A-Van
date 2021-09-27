var longitude = document.getElementById("user-longitude");
var latitude = document.getElementById("user-latitude");
var waiting = document.getElementById("please-wait");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        return true
    }
}

function showPosition(position) {
    waiting.innerHTML = "Got your location successfully!"
    getVans()
    longitude.value = position.coords.longitude;
    latitude.value = position.coords.latitude;

}

function distance(lon1, lat1, lon2, lat2) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
}

mapboxgl.accessToken = 'pk.eyJ1IjoieWlmZWl3YW5nIiwiYSI6ImNrb3NoMHBvZDAxOWEydnBhcW5oNHhoMnYifQ.RTlQ7_gAcXxw800J7tE3GQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 13,
    center: [144.96332, -37.814]
});

//Fetch stores from API
async function getVans() {
    const res = await fetch('/customer/chooseVan')
    const data = await res.json()
    var vanList = document.getElementById('van-list')

    data.data.forEach(function(item) {
        item.dis = distance(longitude.value, latitude.value, item.location.coordinates[0], item.location.coordinates[1])
    })

    data.data = data.data.sort((a, b) => a.dis < b.dis ? -1 : 1)

    if (Object.keys(data.data).length > 5) {
        data.data = data.data.slice(0, 5)
    }

    data.data.forEach(function(item) {
        if (item.vanRate === '0') {
            vanList.innerHTML += '<li class = "vans"><p style="color:#8a775e;">' + item.vanId + '</p><p class="message">Address: ' + item.address + '<p><p class="message">Rating: No rating yet</p><form action="/customer/chooseVan" method="post" ><input type="hidden" name = "van_id" value="' + item.vanId + '" ><button type="submit" class="register-btn">Choose this van</button></form></li>'
        } else {
            vanList.innerHTML += '<li class = "vans"><p style="color:#8a775e;">' + item.vanId + '</p><p class="message">Address: ' + item.address + '<p><p class="message">Rating: ' + Math.round((Number(item.vanRate) + Number.EPSILON) * 100) / 100 + '/5</p><form action="/customer/chooseVan" method="post" ><input type="hidden" name = "van_id" value="' + item.vanId + '" ><button type="submit" class="register-btn">Choose this van</button></form></li>'
        }
    })

    const vans = data.data.map(van => {
        var rating = van.vanRate
        if (rating === '0') {
            rating = 'No rating yet'
        } else {
            rating += '/5'
        }
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [van.location.coordinates[0], van.location.coordinates[1]]
            },
            properties: {
                vanId: van.vanId,
                description: '<p>' + van.address + '</p><p>Rating: ' + rating + '</p><form action="/customer/chooseVan" method="post" ><input type="hidden" name = "van_id" value="' + van.vanId + '" ><button type="submit" class="register-btn">Choose this van</button></form>'
            }
        }
    })

    loadMap(vans)
}

// Load map with vans
function loadMap(vans) {

    // Add a data source containing one point feature.
    map.addSource('point', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': vans,
        }
    });

    // Add a layer to use the image to represent the data.
    map.addLayer({
        'id': 'point',
        'type': 'symbol',
        'source': 'point', // reference the data source
        'layout': {
            'icon-image': 'cafe-15', // reference the image
            'icon-size': 1.25,
            'text-field': '{vanId}',
            'text-offset': [0, 0.3],
            'text-anchor': 'top'
        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'point', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'point', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'point', function() {
        map.getCanvas().style.cursor = '';
    });

}

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

getLocation()