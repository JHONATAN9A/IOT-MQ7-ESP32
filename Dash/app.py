# Librerias propias
from request import *
from interpolation import *
from map import *

# Librerias server Ploty
import dash
import dash_leaflet as dl
from dash import html, dcc
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd
import geopandas as gpd
import random
from dash.exceptions import PreventUpdate


image_url = ""
image_bounds = [[4.334313, -74.371566], [4.336313, -74.369566]]

external_stylesheets = [
    {
        'href': "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css",
        'rel': 'stylesheet',
        'integrity': "sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9",
        'crossorigin': 'anonymous'
    }
]

external_scripts = [
    {
        'src': "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js",
        'integrity': "sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm",
        'crossorigin': 'anonymous'
    }
]

app = dash.Dash(__name__, 
                external_stylesheets=external_stylesheets, 
                external_scripts=external_scripts)

MODAL_WEB = html.Div([
    html.Div(id="myModal", className="modal", role="dialog", children=[
        html.Div(className="modal-dialog", children=[
            html.Div(className="modal-content", children=[
                html.Div(className="modal-header", children=[
                    html.H4("Título del Modal", className="modal-title"),
                    html.Button("×", id="close-modal", className="close", **{"data-dismiss": "modal"}),
                ]),
                html.Div(className="modal-body", children=[
                    html.P("Contenido del modal"),
                ]),
                html.Div(className="modal-footer", children=[
                    html.Button("Cerrar", id="close-modal", className="btn btn-default", **{"data-dismiss": "modal"}),
                ]),
            ]),
        ]),
    ]),
])

HEADER_WEB = html.Div([
    html.Nav(className="navbar navbar-expand-lg navbar-light",
             style={"background-color": " #106671  ", "padding-left": "10px"},
             children=[
                 html.A(
                     html.Img(className="d-inline-block align-top", 
                              src="/assets/logo1.png", 
                              width="60",  
                              height="60",
                              style={"border-radius": "10px"}),
                     href="",
                     className="navbar-brand"
                 ),
                 html.Button(className="navbar-toggler", type="button", 
                             **{"data-toggle": "collapse", "data-target": "#navbarNav", "aria-controls": "navbarNav", "aria-expanded": "false", "aria-label": "Toggle navigation"},
                             ),
                 html.Div(className="collapse navbar-collapse", id="navbarNav",
                          children=[
                            html.Ul(className="navbar-nav ml-auto",
                                    children=[
                                        html.Li(className="nav-item",
                                                children=[
                                                    html.A("Grafica Temporal", 
                                                           className="nav-link header-item", 
                                                           href="#",
                                                           id="open-modal-button"),
                                                ]),
                                        html.Li(className="nav-item",
                                                children=[
                                                    html.A("Grafica Semanal", className="nav-link header-item", href="#"),
                                                ]),
                                        
                                    ]),
                          ])
             ])
])

MAP_WEB = html.Div([
    dl.Map([
        dl.TileLayer(url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
    ],
    center=(4.335813, -74.371066),
    zoom=15,  # Puedes ajustar el nivel de zoom según tus necesidades
    style={'width': '100%', 'height': '90vh'})
])


data_map = MAP()
markers, circles = data_map.get_markers_sensor()
for marker in markers: MAP_WEB.children[0].children.append(marker)
for circle in circles: MAP_WEB.children[0].children.append(circle)


app.layout = html.Div([
    HEADER_WEB,
    MAP_WEB,
    MODAL_WEB,
    html.Script(src="/assets/web.js")
])







if __name__ == '__main__':
    app.run_server(debug=True)