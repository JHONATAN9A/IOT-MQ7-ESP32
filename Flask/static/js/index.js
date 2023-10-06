
const URL_API = 'http://54.175.85.224:8080/'
//const URL_API = 'http://127.0.0.1:5000/'
let VALUES_GRAFICA = []
let GRAFICAS_NOW = true;

window.onload = function() {
    Create_Map()

    document.getElementById("grafica-now").addEventListener("click", function() {
        let mapDiv = document.getElementById("map");
        var graficas = document.getElementById("con-graficas");
        mapDiv.style.height = "50vh";
        graficas.classList.remove("d-none");

        if(GRAFICAS_NOW){
            GRAFICAS_NOW = false;
            Create_Grafica("sensorChart1", 'Sensor 1', '#002946', 0)
            Create_Grafica("sensorChart2", 'Sensor 2', '#002946', 1)
            Create_Grafica("sensorChart3", 'Sensor 3', '#002946', 2)
        }
        
        
    });
};

function getCookie(name='token') {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function Create_Map(){
    const map = new maplibregl.Map({
        container: 'map',
        // Use a minimalist raster style
        style: {
            'version': 8,
            'name': 'Blank',
            'center': [0, 0],
            'zoom': 0,
            'sources': {
                'raster-tiles': {
                    'type': 'raster',
                    'tiles': ['http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga'],
                    'tileSize': 256,
                    'minzoom': 0,
                    'maxzoom': 19
                }
            },
            'layers': [
                {
                    'id': 'background',
                    'type': 'background',
                    'paint': {
                        'background-color': '#e0dfdf'
                    }
                },
                {
                    'id': 'simple-tiles',
                    'type': 'raster',
                    'source': 'raster-tiles'
                }
            ],
            'id': 'blank'
        },
        center: [-74.370013, 4.334723],
        zoom: 13,
        pitch: 40,
        bearing: 20,
        antialias: true
    });

    const size = 200;

    // implementation of StyleImageInterface to draw a pulsing dot icon on the map
    // Search for StyleImageInterface in https://maplibre.org/maplibre-gl-js/docs/API/
    const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            context.fillStyle = `rgba(255, 200, 200,${1 - t})`;
            context.fill();

            // draw inner circle
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // update this image's data with data from the canvas
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            // continuously repaint the map, resulting in the smooth animation of the dot
            map.triggerRepaint();

            // return `true` to let the map know that the image was updated
            return true;
        }
    };

    map.on('load', () => {
        map.addImage('pulsing-dot', pulsingDot, {pixelRatio: 2});

        map.addSource('points', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-74.370013, 4.334723]
                        }
                    }
                ]
            }
        });
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                'icon-image': 'pulsing-dot'
            }
        });
    });

}


function Create_Grafica(id, sensor, color, index){
    let ctx = document.getElementById(id).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: sensor,
                    data: [],
                    borderColor: color,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });

    function addDataToChart(label, value, datasetIndex) {
        
        chart.data.labels.push(label);
        chart.data.datasets[datasetIndex].data.push(value);
        chart.update();
    }

    function fetchDataAndUpdateChart() {
        const token = getCookie('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        fetch(URL_API+'last_registro_co',{
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => {
            if (!(VALUES_GRAFICA.includes(data.id))) {
                if(data.codigo == index){
                    console.log(data)
                    const value = data.valor;
                    addDataToChart(data.hora, value, 0);
                    VALUES_GRAFICA.push(data.id)
                } 
            }
            
        })
        .catch(error => console.error('Error al obtener datos: ', error));
    }

    setInterval(() => {
        fetchDataAndUpdateChart();
    }, 1000);

}
    
