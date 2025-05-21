from flask import Blueprint, request, jsonify
from database.models import Database, Product
from .auth import token_required

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

# Create a global database connection
db = Database()
product_model = Product(db)

@products_bp.route('', methods=['GET'])
def get_all_products():
    limit = request.args.get('limit', type=int)
    offset = request.args.get('offset', type=int)
    
    products = product_model.get_all(limit=limit, offset=offset)
    return jsonify({'products': products, 'count': len(products)}), 200

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    product = product_model.get_by_id(product_id)
    
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    return jsonify({'product': product}), 200

@products_bp.route('/category/<category>', methods=['GET'])
def get_products_by_category(category):
    limit = request.args.get('limit', type=int)
    
    products = product_model.get_by_category(category, limit=limit)
    return jsonify({'products': products, 'count': len(products)}), 200

@products_bp.route('/sale', methods=['GET'])
def get_sale_products():
    limit = request.args.get('limit', type=int)
    
    products = product_model.get_on_sale(limit=limit)
    return jsonify({'products': products, 'count': len(products)}), 200

@products_bp.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    limit = request.args.get('limit', type=int)
    
    if not query:
        return jsonify({'message': 'Search query is required'}), 400
        
    products = product_model.search(query, limit=limit)
    return jsonify({'products': products, 'count': len(products), 'query': query}), 200

@products_bp.route('', methods=['POST'])
@token_required
def create_product():
    # This endpoint would typically be restricted to admin users
    # For simplicity, we'll just check if the user is authenticated
    data = request.json
    
    if not data or not data.get('name') or not data.get('price') or not data.get('category'):
        return jsonify({'message': 'Name, price and category are required'}), 400
        
    product_id = product_model.create(data)
    
    return jsonify({
        'message': 'Product created successfully',
        'product_id': product_id
    }), 201

@products_bp.route('/<product_id>', methods=['PUT'])
@token_required
def update_product(product_id):
    # This endpoint would typically be restricted to admin users
    data = request.json
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    product = product_model.get_by_id(product_id)
    
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    success = product_model.update(product_id, data)
    
    if not success:
        return jsonify({'message': 'Failed to update product'}), 400
        
    updated_product = product_model.get_by_id(product_id)
    
    return jsonify({
        'message': 'Product updated successfully',
        'product': updated_product
    }), 200 