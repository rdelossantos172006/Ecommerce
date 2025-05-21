from flask import Blueprint, request, jsonify
from database.models import Database, Review
from .auth import token_required

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

# Create a global database connection
db = Database()
review_model = Review(db)

@reviews_bp.route('/product/<product_id>', methods=['GET'])
def get_product_reviews(product_id):
    reviews = review_model.get_by_product(product_id)
    return jsonify({'reviews': reviews, 'count': len(reviews)}), 200

@reviews_bp.route('/product/<product_id>', methods=['POST'])
@token_required
def create_review(product_id):
    data = request.json
    
    if not data or not isinstance(data.get('rating'), (int, float)):
        return jsonify({'message': 'Rating is required and must be a number'}), 400
        
    user_id = request.user['id']
    rating = data.get('rating')
    comment = data.get('comment')
    
    # Validate rating range
    if rating < 1 or rating > 5:
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400
    
    review_id = review_model.create(product_id, user_id, rating, comment)
    
    if not review_id:
        return jsonify({'message': 'Failed to create review'}), 400
        
    return jsonify({'message': 'Review created successfully', 'review_id': review_id}), 201 