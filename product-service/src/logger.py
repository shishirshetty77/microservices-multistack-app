import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""
    
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
        }
        
        if hasattr(record, 'data') and record.data:
            log_entry['data'] = record.data
            
        if record.exc_info:
            log_entry['error'] = self.formatException(record.exc_info)
            
        return json.dumps(log_entry)

def setup_logger(level='info'):
    """Setup structured JSON logger"""
    logger = logging.getLogger('product-service')
    
    # Set level
    log_level = getattr(logging, level.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    # Create handler
    handler = logging.StreamHandler()
    handler.setLevel(log_level)
    
    # Set formatter
    formatter = JSONFormatter()
    handler.setFormatter(formatter)
    
    # Add handler
    logger.addHandler(handler)
    
    return logger
