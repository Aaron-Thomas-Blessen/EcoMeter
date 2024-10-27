import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# Simulate historical data for training (replace with actual data)
data = np.array([np.sin(x / 10) for x in range(500)])  # Example sinusoidal pattern
scaler = MinMaxScaler()
data = scaler.fit_transform(data.reshape(-1, 1))

# Prepare sequences for LSTM
X, y = [], []
time_steps = 30
for i in range(time_steps, len(data)):
    X.append(data[i-time_steps:i, 0])
    y.append(data[i, 0])

X, y = np.array(X), np.array(y)
X = X.reshape((X.shape[0], X.shape[1], 1))

# Define and train the LSTM model
model = Sequential([
    LSTM(50, activation='relu', input_shape=(X.shape[1], 1)),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X, y, epochs=20, batch_size=32)

# Save the model
model.save("energy_predictor.h5")
