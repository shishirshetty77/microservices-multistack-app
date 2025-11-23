from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
from datetime import datetime
import os
import signal
import sys

from routes import register_routes
from config import Config
from logger import setup_logger

app = Flask(__name__)
CORS(app)

config = Config()

logger = setup_logger(config.LOG_LEVEL)

register_routes(app, logger)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': config.SERVICE_NAME,
        'time': datetime.utcnow().isoformat()
    }), 200

def signal_handler(sig, frame):
    logger.info('Shutting down gracefully...')
    sys.exit(0)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info(f'Starting {config.SERVICE_NAME} on port {config.PORT}')
    
    app.run(
        host='0.0.0.0',
        port=int(config.PORT),
        debug=config.LOG_LEVEL == 'debug'
    )
