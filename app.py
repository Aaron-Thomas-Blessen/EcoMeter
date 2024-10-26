from fastapi import FastAPI, WebSocket, HTTPException
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json
import asyncio
from collections import deque
import plotly.graph_objects as go
from dash import Dash, dcc, html
from dash.dependencies import Input, Output
import threading

app = FastAPI()

class SmartMeterAnalyzer:
    def __init__(self):
        self.readings = deque(maxlen=1000)
        self.total_consumption = 0
        self.scaler = StandardScaler()
        self.anomaly_detector = IsolationForest(contamination=0.1)

    async def process_reading(self, reading):
        timestamp = datetime.fromisoformat(reading['timestamp'])
        consumption = float(reading['consumption'])
        
        self.readings.append({'timestamp': timestamp, 'consumption': consumption})
        self.total_consumption += consumption

        # Anomaly detection (placeholder implementation)
        if len(self.readings) >= 10:
            recent_data = np.array([r['consumption'] for r in self.readings]).reshape(-1, 1)
            self.scaler.fit_transform(recent_data)
            anomaly_score = self.anomaly_detector.fit_predict([recent_data[-1]])[0]
            if anomaly_score == -1:
                print("Anomaly detected")

        return {"timestamp": timestamp, "consumption": consumption}

class DashboardApp:
    def __init__(self, analyzer):
        self.app = Dash(__name__)
        self.analyzer = analyzer
        self.app.layout = self.create_layout()
        self.setup_callbacks()

    def create_layout(self):
        return html.Div([
            html.H1("Smart Meter Dashboard"),
            dcc.Graph(id='consumption-graph'),
            dcc.Interval(id='interval-component', interval=1000, n_intervals=0)
        ])

    def setup_callbacks(self):
        @self.app.callback(Output('consumption-graph', 'figure'), [Input('interval-component', 'n_intervals')])
        def update_graph(n):
            data = list(self.analyzer.readings)
            if not data:
                return go.Figure()
            df = pd.DataFrame(data)
            fig = go.Figure(go.Scatter(x=df['timestamp'], y=df['consumption'], mode='lines+markers'))
            fig.update_layout(title="Real-time Energy Consumption", xaxis_title="Time", yaxis_title="kWh")
            return fig

    def run(self):
        self.app.run_server(debug=True, use_reloader=False, port=8050)

analyzer = SmartMeterAnalyzer()
dashboard = DashboardApp(analyzer)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            reading = json.loads(data)
            await analyzer.process_reading(reading)
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.on_event("startup")
def start_dashboard():
    threading.Thread(target=dashboard.run).start()
