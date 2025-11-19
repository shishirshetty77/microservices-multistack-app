import os

class Config:
    """Application configuration"""
    
    def __init__(self):
        self.PORT = os.getenv('PORT', '8002')
        self.SERVICE_NAME = os.getenv('SERVICE_NAME', 'product-service')
        self.LOG_LEVEL = os.getenv('LOG_LEVEL', 'info')
        self.USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user-service:8001')
