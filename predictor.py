import json
import asyncio
import websockets
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

# Load the trained model and scaler
model = load_model("energy_predictor.h5")
scaler = MinMaxScaler()

# Initialize rolling window with zeros (30 steps of recent data)
time_steps = 30
rolling_window = [0.0] * time_steps

async def process_data():
    async with websockets.connect("ws://localhost:8765") as websocket:
        while True:
            # Receive data
            message = await websocket.recv()
            data_point = json.loads(message)
            usage = data_point["usage"]

            # Update rolling window with new data
            rolling_window.pop(0)
            rolling_window.append(usage)

            # Scale and reshape data for model input
            input_data = scaler.fit_transform(np.array(rolling_window).reshape(-1, 1))
            input_data = np.array(input_data).reshape((1, time_steps, 1))

            # Make prediction
            predicted_usage = model.predict(input_data)
            predicted_usage = scaler.inverse_transform(predicted_usage)[0][0]

            # Print or store the predicted usage
            print(f"Predicted next usage: {predicted_usage} kWh")

            # Wait before next prediction cycle
            await asyncio.sleep(5)

# Run the real-time prediction loop
asyncio.run(process_data())
