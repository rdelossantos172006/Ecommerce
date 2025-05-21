from flask import Blueprint, request, jsonify
from database.models import Database, Wishlist
from .auth import token_required

wishlist_bp = Blueprint('wishlist', __name__, url_prefix='/api/wishlist')

# Create a global database connection
db = Database()
wishlist_model = Wishlist(db)

@wishlist_bp.route('', methods=['GET'])
@token_required
def get_wishlist():
    user_id = request.user['id']
    wishlist_items = wishlist_model.get_user_wishlist(user_id)
    return jsonify({'items': wishlist_items, 'count': len(wishlist_items)}), 200

@wishlist_bp.route('', methods=['POST'])
@token_required
def add_to_wishlist():
    data = request.json
    
    if not data or not data.get('product_id'):
        return jsonify({'message': 'Product ID is required'}), 400
        
    user_id = request.user['id']
    product_id = data.get('product_id')
    
    success = wishlist_model.add_item(user_id, product_id)
    
    if not success:
        return jsonify({'message': 'Product already in wishlist'}), 409
        
    return jsonify({'message': 'Product added to wishlist'}), 201

@wishlist_bp.route('/<product_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(product_id):
    user_id = request.user['id']
    
    success = wishlist_model.remove_item(user_id, product_id)
    
    if not success:
        return jsonify({'message': 'Product not found in wishlist'}), 404
        
    return jsonify({'message': 'Product removed from wishlist'}), 200 