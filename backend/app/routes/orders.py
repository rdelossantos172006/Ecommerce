from flask import Blueprint, request, jsonify
from database.models import Database, Order
from .auth import token_required

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# Create a global database connection
db = Database()
order_model = Order(db)

@orders_bp.route('', methods=['GET'])
@token_required
def get_user_orders():
    user_id = request.user['id']
    orders = order_model.get_user_orders(user_id)
    return jsonify({'orders': orders, 'count': len(orders)}), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(order_id):
    user_id = request.user['id']
    order = order_model.get_by_id(order_id, user_id)
    
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    return jsonify({'order': order}), 200

@orders_bp.route('', methods=['POST'])
@token_required
def create_order():
    data = request.json
    
    if not data or not data.get('items') or not data.get('total_amount'):
        return jsonify({'message': 'Items and total amount are required'}), 400
        
    user_id = request.user['id']
    items = data.get('items')
    total_amount = data.get('total_amount')
    shipping_address = data.get('shipping_address')
    payment_method = data.get('payment_method')
    
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({'message': 'Items must be a non-empty array'}), 400
        
    order_id = order_model.create(
        user_id, 
        items, 
        total_amount, 
        shipping_address, 
        payment_method
    )
    
    if not order_id:
        return jsonify({'message': 'Failed to create order'}), 400
        
    order = order_model.get_by_id(order_id, user_id)
    
    return jsonify({
        'message': 'Order created successfully',
        'order': order
    }), 201 