FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code, model, and QR code scripts
COPY server.py .
COPY trained_model.pkl .
COPY generate_qrcode.py .
COPY test_qrcode.py .

# Set environment variables
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run the application with Gunicorn
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
