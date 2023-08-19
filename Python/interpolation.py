import geopandas as gpd
from shapely.geometry import Point
import numpy as np
from scipy.interpolate import Rbf
import matplotlib.pyplot as plt



class interpolation:
    def __init__(self):
        self.path_img = './static/images'

    def calculate_region(self, gdf, extra_space):
        self.coordinates = np.array(gdf.geometry.apply(lambda geom: (geom.x, geom.y)).tolist())
        x_min, y_min = np.min(self.coordinates, axis=0)
        x_max, y_max = np.max(self.coordinates, axis=0)
        x_range = np.linspace(x_min - extra_space, x_max + extra_space, 400)
        y_range = np.linspace(y_min - extra_space, y_max + extra_space, 400)
        self.xx, self.yy = np.meshgrid(x_range, y_range)

        print("Cord max_X_Y: ", x_max, y_max)
        print("Cord min_X_Y: ", x_min, y_min)

    def interpolated_rbf(self, gdf, iterator):
        interpolation_points = np.vstack((self.xx.ravel(), self.yy.ravel())).T
        values = np.array(gdf['valor'])
        rbf = Rbf(self.coordinates[:, 0], self.coordinates[:, 1], values, function='linear')
        interpolated_values = rbf(interpolation_points[:, 0], interpolation_points[:, 1])

        interpolated_image = interpolated_values.reshape(self.xx.shape)
        plt.imsave(self.path_img+'/img_'+str(iterator)+'.png', interpolated_image, cmap='viridis', format='png')

    



# # Crear un GeoDataFrame con los datos proporcionados
# data = {
#     'geometry': [
#         Point(-74.47477, 4.44420), Point(-74.27477, 4.44420), Point(-74.07477, 4.44420),
#         Point(-74.47477, 4.24420), Point(-74.27477, 4.24420), Point(-74.07477, 4.24420),
#         Point(-74.47477, 4.04420), Point(-74.27477, 4.04420), Point(-74.07477, 4.04420)
#     ],
#     'sensor': ['mq_01', 'mq_02', 'mq_03', 'mq_04', 'mq_05', 'mq_06', 'mq_07', 'mq_08', 'mq_09'],
#     'valor': [88.90, 84.23, 92.17, 88.65, 81.98, 93.54, 85.76, 91.45, 89.87]
# }

# gdf = gpd.GeoDataFrame(data, columns=['geometry', 'sensor', 'valor'])

# # Obtener las coordenadas de los puntos
# coordinates = np.array(gdf.geometry.apply(lambda geom: (geom.x, geom.y)).tolist())

# # Definir el espacio adicional alrededor de los puntos
# extra_space = 0.1  # Ajusta según tus preferencias

# # Definir el rango de coordenadas para la interpolación
# x_min, y_min = np.min(coordinates, axis=0)
# x_max, y_max = np.max(coordinates, axis=0)
# x_range = np.linspace(x_min - extra_space, x_max + extra_space, 400)
# y_range = np.linspace(y_min - extra_space, y_max + extra_space, 400)
# xx, yy = np.meshgrid(x_range, y_range)
# interpolation_points = np.vstack((xx.ravel(), yy.ravel())).T

# # Valores de los sensores en los puntos del gdf
# values = np.array(gdf['valor'])

# # Realizar la interpolación por función de base radial (RBF)
# rbf = Rbf(coordinates[:, 0], coordinates[:, 1], values, function='linear')
# interpolated_values = rbf(interpolation_points[:, 0], interpolation_points[:, 1])

# # Crear una imagen de la interpolación
# interpolated_image = interpolated_values.reshape(xx.shape)

# # Visualizar la imagen
# plt.figure(figsize=(8, 8))  # Ajusta el tamaño de la figura
# plt.imshow(interpolated_image, extent=(x_min - extra_space, x_max + extra_space, y_min - extra_space, y_max + extra_space), origin='lower',
#            cmap='viridis', aspect='auto', interpolation='bilinear')  # Utiliza interpolation='bilinear'
# plt.colorbar(label='Valor Interpolado')
# plt.scatter(coordinates[:, 0], coordinates[:, 1], c='red', label='Datos Originales')  # Muestra los puntos originales
# plt.xlabel('Longitud')
# plt.ylabel('Latitud')
# plt.title('Interpolación por Función de Base Radial (RBF)')
# plt.legend()

# # Guardar la imagen en formato .jpg
# plt.imsave('interpolated_image.jpg', interpolated_image, cmap='viridis', format='jpg')

# plt.show()
