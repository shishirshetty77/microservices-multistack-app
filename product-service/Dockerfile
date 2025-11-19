# Build stage
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 8002

# Set Python path
ENV PYTHONPATH=/app/src

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8002", "--workers", "2", "--timeout", "60", "src.app:app"]
