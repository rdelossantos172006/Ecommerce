from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Set up configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key_for_ruby_shop'),
        DATABASE_NAME=os.environ.get('DATABASE_NAME', 'rubyshop.db'),
        JWT_SECRET=os.environ.get('JWT_SECRET', 'jwt_secret_for_ruby_shop'),
        JWT_EXPIRATION=int(os.environ.get('JWT_EXPIRATION', 86400))  # 24 hours in seconds
    )
    
    # Register blueprints (routes)
    from .routes import auth_bp, products_bp, orders_bp, wishlist_bp, reviews_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(reviews_bp)
    
    return app 