from datetime import datetime
from typing import Optional

class Product:
    """Product model"""
    
    def __init__(self, name: str, price: float, stock: int, product_id: Optional[str] = None):
        self.id = product_id
        self.name = name
        self.price = price
        self.stock = stock
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def validate(self) -> tuple[bool, Optional[str]]:
        """Validate product data"""
        if not self.name or self.name.strip() == '':
            return False, "Product name is required"
        
        if self.price is None or self.price < 0:
            return False, "Product price must be non-negative"
        
        if self.stock is None or self.stock < 0:
            return False, "Product stock must be non-negative"
        
        return True, None
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'stock': self.stock,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
    
    @staticmethod
    def from_dict(data: dict):
        """Create product from dictionary"""
        return Product(
            name=data.get('name', ''),
            price=data.get('price', 0.0),
            stock=data.get('stock', 0),
            product_id=data.get('id')
        )
