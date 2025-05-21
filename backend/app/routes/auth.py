from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
import functools
import json
from database.models import Database, User
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Create a global database connection
db = Database()
user_model = User(db)

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_EXPIRATION'])
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET'], algorithm='HS256')

def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({'message': 'Authentication required'}), 401
            
        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
            user_id = payload['user_id']
            user = user_model.get_by_id(user_id)
            
            if not user:
                return jsonify({'message': 'Invalid token or user not found'}), 401
                
            # Add user to the request context
            request.user = user
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
            
        return f(*args, **kwargs)
    return decorated

# Add email validation function
def is_valid_email(email):
    """Validate email format using regex pattern"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
        
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    # Validate email format
    if not is_valid_email(email):
        return jsonify({'message': 'Invalid email format'}), 400
    
    # Validate password
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters long'}), 400
    
    user_id = user_model.create(email, password, name)
    
    if user_id is None:
        return jsonify({'message': 'User with this email already exists'}), 409
        
    token = generate_token(user_id)
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'id': user_id,
            'email': email,
            'name': name
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
        
    email = data.get('email')
    password = data.get('password')
    
    # Validate email format
    if not is_valid_email(email):
        return jsonify({'message': 'Invalid email format'}), 400
    
    user = user_model.authenticate(email, password)
    
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
        
    token = generate_token(user['id'])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name']
        }
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    return jsonify({
        'user': {
            'id': request.user['id'],
            'email': request.user['email'],
            'name': request.user['name']
        }
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    data = request.json
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    name = data.get('name')
    email = data.get('email')
    
    success = user_model.update(request.user['id'], name=name, email=email)
    
    if not success:
        return jsonify({'message': 'Failed to update profile'}), 400
        
    # Get updated user information
    updated_user = user_model.get_by_id(request.user['id'])
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': updated_user['id'],
            'email': updated_user['email'],
            'name': updated_user['name']
        }
    }), 200 