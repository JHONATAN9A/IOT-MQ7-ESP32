# Librerias propias
from request import *
from interpolation import *

# Librerias server Ploty
import dash
import dash_leaflet as dl
from dash import html, dcc
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd
import geopandas as gpd



app = dash.Dash(__name__)

get_data = API()
grilla = get_data.create_grilla(4.335813, -74.371066, 0.001)

get_img = interpolation()
get_img.calculate_region(grilla, 0.1)


image_url = ""
image_bounds = [[4.334313, -74.371566], [4.336313, -74.369566]]


initial_data = {row['sensor']: [row['valor']] for _, row in  grilla.iterrows()}
df = pd.DataFrame(initial_data)


app.layout = html.Div([
    html.Div([
        dl.Map([
            dl.TileLayer(),
            dl.ImageOverlay(id='image-overlay', url=image_url, opacity=0.7, bounds=image_bounds)
        ],
        center=(4.335813, -74.371066),
        zoom=22,
        style={'width': '100%', 'height': '99vh'})
    ], style={'width': '40%', 'display': 'inline-block', 'vertical-align': 'top'}),
    
    html.Div([
        dcc.Graph(id='line-graph',
                style={'height': '55vh'}),
        dcc.Interval(
            id='interval-component',
            interval=1000,
            n_intervals=0
        )
    ], style={'width': '59%', 'display': 'inline-block', 'vertical-align': 'top'})
])


@app.callback(
    Output('line-graph', 'figure'),
    Input('interval-component', 'n_intervals')
)
def update_line_graph(n_intervals):
    global df 

    gpd = get_data.request(grilla, get_img, n_intervals)
   
    new_row = {row['sensor']: [row['valor']] for _, row in  gpd.iterrows()}
    df = pd.concat([df, pd.DataFrame(new_row)], ignore_index=True)

    traces = []
    for column in df.columns:
        traces.append({'x': list(range(1, len(df[column]) + 1)), 'y': df[column], 'name': column})

    figure = {'data': traces, 'layout': {'xaxis': {'title': 'Tiempo (sg)'}, 'yaxis': {'title': 'Valor (dpm)'}}}
    return figure


@app.callback(
    Output('image-overlay', 'url'),
    Input('interval-component', 'n_intervals') 
)

def update_image(n_intervals):
    image_filename = ""

    if n_intervals != 0: 
        image_filename = f"http://127.0.0.1:5000/static/images/img_{str(n_intervals-1)}.png"

    return image_filename



if __name__ == '__main__':
    app.run_server(debug=True)