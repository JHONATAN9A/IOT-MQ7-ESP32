import requests
import geopandas as gpd
from shapely.geometry import Point



class API:
    def __init__(self):
        self.endpoint = ['mq_01', 'mq_02', 'mq_03', 'mq_04', 'mq_05', 'mq_06', 'mq_07', 'mq_08', 'mq_09']
        self.intialValues = [84.9, 84.23, 92.17, 10.65, 81.98, 43.54, 85.76, 91.45, 849.87]
        self.url = 'http://192.168.101.162/'
        
    
    def create_grilla(self, central_latitude, central_longitude, side_length):
        half_side = side_length / 2
        coordinates = []
        for row in range(3):
            for col in range(3):
                lon = central_longitude + col * side_length - half_side
                lat = central_latitude - row * side_length + half_side
                coordinates.append((lon, lat))

        points = [Point(lon, lat) for lon, lat in coordinates]
        gdf = gpd.GeoDataFrame(geometry=points, crs='EPSG:4326')
        gdf['sensor'] = self.endpoint
        gdf['valor'] =  self.intialValues

        return gdf

        
    def request(self, data_initial, img, interval):
        # for endpoint in self.endpoint:
        #     response = requests.get(self.url+endpoint)



        img.interpolated_rbf(data_initial, interval)
        return data_initial