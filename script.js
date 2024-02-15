mapboxgl.accessToken = 'pk.eyJ1IjoibWFzMDIzIiwiYSI6ImNsc2txcnZpODA2c24ycW80eGp5cGZhaHcifQ.W8g17Taw2vODdOnvz0UksQ';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-98.5795, 39.8283], // starting position [lng, lat]
    zoom: 3 // starting zoom
});

map.on('load', function () {
    // After the map loads, add your data source and create a layer to display it
    map.addSource('states', {
        type: 'geojson',
        data: '/Users/marcosanchez/energyconsumption/data.json' // Path to your GeoJSON data
    });

    map.addLayer({
        'id': 'states-heat',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'energyConsumption'], // Replace with your property
                0, '#F2F12D',
                5000, '#EED322',
                10000, '#E6B71E',
                20000, '#DA9C20',
                30000, '#CA8323',
                40000, '#B86B25',
                50000, '#A25626',
                60000, '#8B4225',
                70000, '#723122'
            ],
            'fill-opacity': 0.75
        }
    });
});

// Example of adding a click event to show a popup
map.on('click', 'states-heat', function (e) {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<h3>${e.features[0].properties.name}</h3><p>Energy Consumption: ${e.features[0].properties.energyConsumption}</p>`)
        .addTo(map);
});
