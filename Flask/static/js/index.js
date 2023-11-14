
//const URL_API = 'http://127.0.0.1:5000/'
const URL_API = 'http://18.191.202.133:8000/'


let VALUES_GRAFICA = []
let GRAFICAS_NOW = true;


function getCookie(name='token') {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

window.onload = function() {
    Create_Map()

    document.getElementById("grafica-now").addEventListener("click", function() {
        let mapDiv = document.getElementById("map");
        var graficas = document.getElementById("con-graficas");
        mapDiv.style.height = "50vh";
        graficas.classList.remove("d-none");

        if(GRAFICAS_NOW){
            GRAFICAS_NOW = false;
            Create_Grafica("sensorChart1", 'Sensor 1', '#002946', 0, 'mq7_sensor01')
            Create_Grafica("sensorChart2", 'Sensor 2', '#002946', 1, 'mq7_sensor02')
            Create_Grafica("sensorChart3", 'Sensor 3', '#002946', 2, 'mq7_sensor03')
        } 
    });
    document.getElementById("grafica-week").addEventListener("click", function() {
        $('.bd-example-modal-lg').modal('show')
        let modalTitle = $('.modal').find('.modal-title');
        modalTitle.text('Historico Semanal (6-11-2023 al 10-11-2023)');
        
        const token = getCookie('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        fetch(URL_API+'get_matriz_co',{
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => {
            Create_Matriz_Week(data.data)
            
        })
        .catch(error => console.error('Error al obtener datos: ', error));
    });

    document.getElementById("grafica-matriz-second").addEventListener("click", function() {
        $('.bd-example-modal-lg-two').modal('show')
        let modalTitle = $('.modal').find('.modal-title');
        modalTitle.text('Matriz Temporal');

        Create_Matriz_now('', false);

        function obtenerYCrearMatriz() {
            const token = getCookie('token');
            const headers = {
                'Authorization': `Bearer ${token}`
            };
        
            fetch(URL_API+'get_matriz_one_co',{
                method: 'GET',
                headers: headers
            })
            .then(response => response.json())
            .then(data => {
                let sensore = data.data;
                Create_Matriz_now(sensore, true);
                
            })
            .catch(error => console.error('Error al obtener datos: ', error));
        }

        setInterval(obtenerYCrearMatriz, 500);  
    });
    
    let closeButtons = document.querySelectorAll("#close-modal");

    closeButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            $('.bd-example-modal-lg').modal('hide');
            $('.bd-example-modal-lg-two').modal('hide');
        });
    });

};

let myConfig;
function Create_Matriz_now(datos_matriz, updates_matriz) {
    if (!updates_matriz) {
        myConfig = {
            "graphset": [{
                "type": 'piano',
                "plotarea": {
                    "margin": "dynamic"
                },
                "crosshair-x": {
                    "visible": true
                },
                "plot": {
                    "reference": "chart-max",
                    "background-color": "white",
                    "border-color": "#c3ccd8",
                    "border-width": 1,
                    "aspect": "none",
                    "hover-state": {
                        "visible": true,
                        
                    },
                    "tooltip": {
                        "visible": true,
                        "text": "%data-custom-values",
                        "font-size": 14
                    },
                },
                "series": [{
                        "values": [0],
                        "data-custom-values": [0],
                        "rules": [
                            { "rule": "%v <= 300",             "background-color": "rgb(237, 244, 251)" },
                            { "rule": "%v > 300 && %v <= 385", "background-color": "rgb(228, 238, 248)" },
                            { "rule": "%v > 385 && %v <= 435", "background-color": "rgb(218, 232, 245)" },
                            { "rule": "%v > 435 && %v <= 470", "background-color": "rgb(209, 226, 242)" },
                            { "rule": "%v > 470 && %v <= 505", "background-color": "rgb(200, 220, 239)" },
                            { "rule": "%v > 505 && %v <= 540", "background-color": "rgb(186, 214, 234)" },
                            { "rule": "%v > 540 && %v <= 575", "background-color": "rgb(171, 207, 229)" },
                            { "rule": "%v > 575 && %v <= 625", "background-color": "rgb(155, 200, 224)" },
                            { "rule": "%v > 625 && %v <= 675", "background-color": "rgb(136, 190, 220)" },
                            { "rule": "%v > 675 && %v <= 755", "background-color": "rgb(117, 179, 216)" },
                            { "rule": "%v > 755 && %v <= 840", "background-color": "rgb(98, 168, 210)" },
                            { "rule": "%v > 840 && %v <= 925", "background-color": "rgb(83, 157, 204)" },
                            { "rule": "%v > 925 && %v <= 1010", "background-color": "rgb(67, 147, 198)" },
                            { "rule": "%v > 1010 && %v <= 1095", "background-color": "rgb(55, 135, 192)" },
                            { "rule": "%v > 1095 && %v <= 1180", "background-color": "rgb(42, 122, 185)" },
                            { "rule": "%v > 1180 && %v <= 1265", "background-color": "rgb(30, 109, 178)" },
                            { "rule": "%v > 1265 && %v <= 1350", "background-color": "rgb(20, 97, 168)" },
                            { "rule": "%v > 1350 && %v <= 1435", "background-color": "rgb(11, 85, 159)" },
                            { "rule": "%v > 1435 && %v <= 1745", "background-color": "rgb(8, 72, 143)" },
                            { "rule": "%v > 1745 ", "background-color": "rgb(8, 60, 125)" },
          
                        ]
                        
                    },
                ],
                "scale-x": {
                    "labels": [0],
                    "placement": "opposite",
                    "line-color": "#c3ccd8",
                    "zooming": true,
                    "max-labels": 24,
                    "guide": {
                        "visible": false
                    },
                    "tick": {
                        "visible": false
                    },
                    "item": {
                        "font-size": 14,
                        "bold": true
                    }
                },
                "scale-y": {
                    "labels": ["MQ1", "MQ2", "MQ3"],
                    "line-color": "#c3ccd8",
                    "zooming": true,
                    "mirrored": true,
                    "guide": {
                        "visible": false
                    },
                    "tick": {
                        "visible": false
                    },
                    "item": {
                        "font-size": 14,
                        "bold": true
                    }
                }
            }]
        }

        zingchart.render({
            id: 'matrizOneSecond1',
            data: myConfig,
            height: '150',
            width: '100%'
        });
        zingchart.render({
            id: 'matrizOneSecond2',
            data: myConfig,
            height: '150',
            width: '100%'
        });
        zingchart.render({
            id: 'matrizOneSecond3',
            data: myConfig,
            height: '150',
            width: '100%'
        });
    } else {
        myConfig.graphset[0].series.forEach((series, index) => {
            series.values = datos_matriz["MQ1"];
            series["data-custom-values"] = datos_matriz["MQ1"]
        });
        myConfig.graphset[0]["scale-x"].labels = datos_matriz["Time-MQ1"]
        myConfig.graphset[0]["scale-y"].labels = ["MQ1"]

        zingchart.render({
            id: 'matrizOneSecond1',
            data: myConfig,
            height: '150',
            width: '100%'
        });

        myConfig.graphset[0].series.forEach((series, index) => {
            series.values = datos_matriz["MQ2"];
            series["data-custom-values"] = datos_matriz["MQ2"]
        });
        myConfig.graphset[0]["scale-x"].labels = datos_matriz["Time-MQ2"]
        myConfig.graphset[0]["scale-y"].labels = ["MQ2"]

        zingchart.render({
            id: 'matrizOneSecond2',
            data: myConfig,
            height: '150',
            width: '100%'
        });

        myConfig.graphset[0].series.forEach((series, index) => {
            series.values = datos_matriz["MQ3"];
            series["data-custom-values"] = datos_matriz["MQ3"]
        });
        myConfig.graphset[0]["scale-x"].labels = datos_matriz["Time-MQ3"]
        myConfig.graphset[0]["scale-y"].labels = ["MQ3"]

        zingchart.render({
            id: 'matrizOneSecond3',
            data: myConfig,
            height: '150',
            width: '100%'
        });
    }
}




function Create_Matriz_Week(datos_matriz) {
    let style =()=>{
        let style = [
            {
                "rule": "%v == 0", 
                "background-color": "#c3ccd8" 
            },
            {
                "rule": "%v > 0 && %v <= 500", 
                "background-color": "#2980B9" 
            },
            {
                "rule": "%v > 500 && %v <= 900", 
                "background-color": "#2471A3" 
            },
            {
                "rule": "%v > 900 && %v <= 1300", 
                "background-color": "#1F618D" 
            },
            {
                "rule": "%v > 1300 && %v <= 1700", 
                "background-color": "#1A5276" 
            },
            {
                "rule": "%v > 1700", 
                "background-color": "#154360" 
            }
        ]

        return style;
    }
    

    var myConfig = {
        "type": "heatmap",
        "plotarea": {
            "margin": "dynamic"
        },
        "scale-x": {
            "labels": ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"]
        },
        "scale-y": {
            "labels": ["MQ1-Lunes", "MQ2-Lunes", "MQ3-Lunes", "MQ1-Martes", "MQ2-Martes", "MQ3-Martes", "MQ1-Miercoles", "MQ2-Miercoles", "MQ3-Miercoles", "MQ1-Jueves", "MQ2-Jueves", "MQ3-Jueves", "MQ1-Viernes", "MQ2-Viernes", "MQ3-Viernes"],
            "item": {
                "wrap-text": true, 
            },
            "max-items": 15,
            
        },
        "series": [{
                "values": datos_matriz['LunesMQ1'],
                "rules": style(),
            },
            {
                "values": datos_matriz['LunesMQ2'],
                "rules": style(),
            },
            {
                "values": datos_matriz['LunesMQ3'],
                "rules": style(),
            },
            {
                "values": datos_matriz['MartesMQ1'],
                "rules": style(),
            },
            {
                "values": datos_matriz['MartesMQ2'],
                "rules": style(),
            },
            {
                "values": datos_matriz['MartesMQ3'],
                "rules": style(),
            },
            {
                "values": datos_matriz['MiercolesMQ1'],
                "rules": style(),
            },
            {
                "values": datos_matriz['MiercolesMQ2'],
                "rules": style(),
            },
            {
                "values": datos_matriz['MiercolesMQ3'],
                "rules": style(),
            },
            {
                "values": datos_matriz['JuevesMQ1'],
                "rules": style(),
            },
            {
                "values": datos_matriz['JuevesMQ2'],
                "rules": style(),
            },
            {
                "values": datos_matriz['JuevesMQ3'],
                "rules": style(),
            },
            {
                "values": datos_matriz['ViernesMQ1'],
                "rules": style(),
            },
            {
                "values": datos_matriz['ViernesMQ2'],
                "rules": style(),
            },
            {
                "values": datos_matriz['ViernesMQ3'],
                "rules": style(),
            }
        ],
        
    };

    // Renderizar el gráfico de calor en un elemento con el ID "matrizWeek"
    zingchart.render({
        id: 'matrizWeek',
        data: myConfig,
        height: '800',
        width: '100%'
    });
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


function Create_Grafica(id, sensor, color, index, dbsensor){
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
            scales: {
                y: {
                    beginAtZero: true, 
                    min: 0,   
                    max: 2100, 
                    title: {
                        display: true,
                        text: 'ppm',
                    },
                },
            },
        },
    });

    VALUES_GRAFICA[sensor] = [];

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
        fetch(URL_API+'get_registro_co?sensor=' + dbsensor,{
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => {
            if (!(VALUES_GRAFICA[sensor].includes(data.id))) {
                const value = data.valor;
                addDataToChart(data.hora, value, 0);
                VALUES_GRAFICA[sensor].push(data.id) 
            }
            
        })
        .catch(error => console.error('Error al obtener datos: ', error));
    }

    setInterval(() => {
        fetchDataAndUpdateChart();
    }, 1000);

}
    
