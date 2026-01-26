# Use official Python image
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy consumer code
COPY . .

# Command to run the consumer
CMD ["python", "main.py"]
