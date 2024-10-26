import asyncio
import websockets
import json
from datetime import datetime
import random

class SmartMeterSimulator:
    def generate_reading(self):
        now = datetime.now().isoformat()
        consumption = random.uniform(0.5, 3.0)  # Random consumption value in kWh
        return {"timestamp": now, "consumption": consumption}

    async def start_streaming(self):
        uri = "ws://127.0.0.1:8000/ws"
        async with websockets.connect(uri) as websocket:
            while True:
                reading = self.generate_reading()
                await websocket.send(json.dumps(reading))
                print(f"Sent reading: {reading}")
                await asyncio.sleep(1)  # Send reading every second

if __name__ == "__main__":
    simulator = SmartMeterSimulator()
    asyncio.run(simulator.start_streaming())
