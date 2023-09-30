import dash_leaflet as dl

class MAP:
    def __init__(self):
        self.coordenas_sensor = [
            (4.328520, -74.357508), #Perdomo 1
            (4.327233, -74.358666), #Perdomo 2
            (4.325870, -74.362023), #Saa 1
        ]
        self.nombres_sensor = [
            "Sensor 1",
            "Sensor 2",
            "Sensor 3",
        ]

    def get_markers_sensor(self):
        markers = []
        circles = []
        for i, coord in enumerate(self.coordenas_sensor):
            marker = dl.Marker(position=coord)
            popup = dl.Popup(children=self.nombres_sensor[i], className="popup")
            marker.children = [popup]
            circle = dl.Circle(
                center=coord,
                radius=100,
                color="#85ffc2",
                fill=True,
                fillOpacity=0.3
            )
            
            markers.append(marker)
            circles.append(circle)
        
        return markers, circles