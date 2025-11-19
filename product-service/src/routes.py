from flask import request, jsonify
from datetime import datetime
from models import Product

# In-memory storage
products = {}
next_id = 1

def register_routes(app, logger):
    """Register all API routes"""
    
    @app.route('/api/products', methods=['POST'])
    def create_product():
        """Create a new product"""
        global next_id
        
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Request body is required'}), 400
            
            product = Product.from_dict(data)
            
            # Validate product
            valid, error = product.validate()
            if not valid:
                logger.warning(f'Product validation failed: {error}')
                return jsonify({'error': error}), 400
            
            # Assign ID
            product.id = str(next_id)
            next_id += 1
            
            # Store product
            products[product.id] = product
            
            logger.info(f'Product created', extra={'data': {'productId': product.id}})
            
            return jsonify(product.to_dict()), 201
            
        except Exception as e:
            logger.error(f'Failed to create product: {str(e)}')
            return jsonify({'error': 'Failed to create product'}), 500
    
    @app.route('/api/products/<product_id>', methods=['GET'])
    def get_product(product_id):
        """Get product by ID"""
        product = products.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product.to_dict()), 200
    
    @app.route('/api/products', methods=['GET'])
    def get_products():
        """Get all products"""
        product_list = [p.to_dict() for p in products.values()]
        return jsonify(product_list), 200
    
    @app.route('/api/products/<product_id>', methods=['PUT'])
    def update_product(product_id):
        """Update a product"""
        try:
            product = products.get(product_id)
            
            if not product:
                return jsonify({'error': 'Product not found'}), 404
            
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Request body is required'}), 400
            
            # Update fields
            if 'name' in data:
                product.name = data['name']
            if 'price' in data:
                product.price = data['price']
            if 'stock' in data:
                product.stock = data['stock']
            
            product.updated_at = datetime.utcnow()
            
            # Validate updated product
            valid, error = product.validate()
            if not valid:
                return jsonify({'error': error}), 400
            
            logger.info(f'Product updated', extra={'data': {'productId': product_id}})
            
            return jsonify(product.to_dict()), 200
            
        except Exception as e:
            logger.error(f'Failed to update product: {str(e)}')
            return jsonify({'error': 'Failed to update product'}), 500
    
    @app.route('/api/products/<product_id>', methods=['DELETE'])
    def delete_product(product_id):
        """Delete a product"""
        if product_id not in products:
            return jsonify({'error': 'Product not found'}), 404
        
        del products[product_id]
        
        logger.info(f'Product deleted', extra={'data': {'productId': product_id}})
        
        return jsonify({'message': 'Product deleted successfully'}), 200
