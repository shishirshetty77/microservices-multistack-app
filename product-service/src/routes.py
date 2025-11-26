from flask import request, jsonify
from datetime import datetime
from models import Product
from db import get_db_connection
from psycopg2.extras import RealDictCursor

def register_routes(app, logger):
    """Register all API routes"""
    
    @app.route('/api/products', methods=['POST'])
    def create_product():
        """Create a new product"""
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
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            try:
                cur.execute(
                    'INSERT INTO products (name, price, stock, created_at, updated_at) VALUES (%s, %s, %s, %s, %s) RETURNING id',
                    (product.name, product.price, product.stock, product.created_at, product.updated_at)
                )
                new_id = cur.fetchone()['id']
                conn.commit()
                product.id = str(new_id)
                
                logger.info(f'Product created', extra={'data': {'productId': product.id}})
                return jsonify(product.to_dict()), 201
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                cur.close()
                conn.close()
            
        except Exception as e:
            logger.error(f'Failed to create product: {str(e)}')
            return jsonify({'error': 'Failed to create product'}), 500
    
    @app.route('/api/products/<product_id>', methods=['GET'])
    def get_product(product_id):
        """Get product by ID"""
        try:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
            row = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not row:
                return jsonify({'error': 'Product not found'}), 404
            
            product = Product(
                name=row['name'],
                price=float(row['price']),
                stock=row['stock'],
                product_id=str(row['id'])
            )
            product.created_at = row['created_at']
            product.updated_at = row['updated_at']
            
            return jsonify(product.to_dict()), 200
        except Exception as e:
            logger.error(f'Failed to get product: {str(e)}')
            return jsonify({'error': 'Failed to get product'}), 500
    
    @app.route('/api/products', methods=['GET'])
    def get_products():
        """Get all products"""
        try:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute('SELECT * FROM products ORDER BY id')
            rows = cur.fetchall()
            
            cur.close()
            conn.close()
            
            product_list = []
            for row in rows:
                p = Product(
                    name=row['name'],
                    price=float(row['price']),
                    stock=row['stock'],
                    product_id=str(row['id'])
                )
                p.created_at = row['created_at']
                p.updated_at = row['updated_at']
                product_list.append(p.to_dict())
                
            return jsonify(product_list), 200
        except Exception as e:
            logger.error(f'Failed to get products: {str(e)}')
            return jsonify({'error': 'Failed to get products'}), 500
    
    @app.route('/api/products/<product_id>', methods=['PUT'])
    def update_product(product_id):
        """Update a product"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request body is required'}), 400

            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            # Check if exists
            cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
            existing = cur.fetchone()
            
            if not existing:
                cur.close()
                conn.close()
                return jsonify({'error': 'Product not found'}), 404
            
            # Build update query
            update_fields = []
            values = []
            
            if 'name' in data:
                update_fields.append('name = %s')
                values.append(data['name'])
            if 'price' in data:
                update_fields.append('price = %s')
                values.append(data['price'])
            if 'stock' in data:
                update_fields.append('stock = %s')
                values.append(data['stock'])
                
            if not update_fields:
                cur.close()
                conn.close()
                return jsonify({'message': 'No fields to update'}), 200
                
            update_fields.append('updated_at = %s')
            values.append(datetime.utcnow())
            
            values.append(product_id)
            
            query = f"UPDATE products SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            
            try:
                cur.execute(query, tuple(values))
                updated_row = cur.fetchone()
                conn.commit()
                
                product = Product(
                    name=updated_row['name'],
                    price=float(updated_row['price']),
                    stock=updated_row['stock'],
                    product_id=str(updated_row['id'])
                )
                product.created_at = updated_row['created_at']
                product.updated_at = updated_row['updated_at']
                
                logger.info(f'Product updated', extra={'data': {'productId': product_id}})
                return jsonify(product.to_dict()), 200
                
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                cur.close()
                conn.close()
            
        except Exception as e:
            logger.error(f'Failed to update product: {str(e)}')
            return jsonify({'error': 'Failed to update product'}), 500
    
    @app.route('/api/products/<product_id>', methods=['DELETE'])
    def delete_product(product_id):
        """Delete a product"""
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute('DELETE FROM products WHERE id = %s RETURNING id', (product_id,))
            deleted = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            if not deleted:
                return jsonify({'error': 'Product not found'}), 404
            
            logger.info(f'Product deleted', extra={'data': {'productId': product_id}})
            return jsonify({'message': 'Product deleted successfully'}), 200
            
        except Exception as e:
            logger.error(f'Failed to delete product: {str(e)}')
            return jsonify({'error': 'Failed to delete product'}), 500
