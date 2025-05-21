import sys
import os
import json
import uuid
from datetime import datetime, timedelta

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from database.models import Database, User, Product

def seed_database():
    # Initialize database
    db = Database()
    
    # Create test user
    user_model = User(db)
    admin_id = user_model.create(
        email="admin@rubyshop.com", 
        password="admin123", 
        name="Admin User"
    )
    
    test_user_id = user_model.create(
        email="test@example.com", 
        password="test123", 
        name="Test User"
    )
    
    print(f"Created admin user with ID: {admin_id}")
    print(f"Created test user with ID: {test_user_id}")
    
    # Create products
    product_model = Product(db)
    
    # Sample products for clothing category
    clothing_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Festive Holiday Sweater",
            "description": "Comfortable and stylish sweater perfect for the holiday season.",
            "price": 799.0,
            "original_price": 1299.0,
            "category": "clothing",
            "image": "https://images.pexels.com/photos/6858618/pexels-photo-6858618.jpeg",
            "rating": 4.5,
            "is_on_sale": True,
            "sizes": ["S", "M", "L", "XL"],
            "discount": 38,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=7)).isoformat(),
            "stock_left": 15,
            "tags": ["sweater", "holiday", "gift"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Cozy Winter Jacket",
            "description": "Stay warm this winter with our cozy and stylish jacket.",
            "price": 1499.0,
            "original_price": 2499.0,
            "category": "clothing",
            "image": "https://images.pexels.com/photos/6112012/pexels-photo-6112012.jpeg",
            "rating": 4.8,
            "is_on_sale": True,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "discount": 40,
            "deal_type": "clearance",
            "deal_ends": (datetime.now() + timedelta(days=5)).isoformat(),
            "stock_left": 10,
            "tags": ["jacket", "winter", "fashion"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Christmas Themed T-Shirt",
            "description": "Show your holiday spirit with this fun Christmas themed t-shirt.",
            "price": 499.0,
            "original_price": 799.0,
            "category": "clothing",
            "image": "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg",
            "rating": 4.2,
            "is_on_sale": True,
            "sizes": ["S", "M", "L", "XL"],
            "discount": 37,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=10)).isoformat(),
            "stock_left": 25,
            "tags": ["t-shirt", "christmas", "casual"]
        }
    ]
    
    # Sample products for electronics category
    electronics_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Wireless Earbuds",
            "description": "High-quality wireless earbuds with noise cancellation.",
            "price": 1299.0,
            "original_price": 2499.0,
            "category": "electronics",
            "image": "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
            "rating": 4.7,
            "is_on_sale": True,
            "sizes": None,
            "discount": 48,
            "deal_type": "flash_sale",
            "deal_ends": (datetime.now() + timedelta(days=2)).isoformat(),
            "stock_left": 8,
            "tags": ["earbuds", "wireless", "audio"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Smart Watch",
            "description": "Track your fitness and stay connected with this stylish smart watch.",
            "price": 1999.0,
            "original_price": 3499.0,
            "category": "electronics",
            "image": "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
            "rating": 4.6,
            "is_on_sale": True,
            "sizes": None,
            "discount": 43,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=12)).isoformat(),
            "stock_left": 15,
            "tags": ["watch", "smart", "fitness"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Portable Bluetooth Speaker",
            "description": "Take your music anywhere with this portable Bluetooth speaker.",
            "price": 899.0,
            "original_price": 1499.0,
            "category": "electronics",
            "image": "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg",
            "rating": 4.3,
            "is_on_sale": True,
            "sizes": None,
            "discount": 40,
            "deal_type": "clearance",
            "deal_ends": (datetime.now() + timedelta(days=4)).isoformat(),
            "stock_left": 12,
            "tags": ["speaker", "bluetooth", "audio"]
        }
    ]
    
    # Sample products for home-decor category
    home_decor_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Christmas Tree Ornament Set",
            "description": "Set of 12 beautiful ornaments for your Christmas tree.",
            "price": 699.0,
            "original_price": 999.0,
            "category": "home-decor",
            "image": "https://images.pexels.com/photos/1661905/pexels-photo-1661905.jpeg",
            "rating": 4.9,
            "is_on_sale": True,
            "sizes": None,
            "discount": 30,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=15)).isoformat(),
            "stock_left": 20,
            "tags": ["ornaments", "christmas", "decoration"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "LED String Lights",
            "description": "Create a magical atmosphere with these warm white LED string lights.",
            "price": 399.0,
            "original_price": 699.0,
            "category": "home-decor",
            "image": "https://images.pexels.com/photos/1893624/pexels-photo-1893624.jpeg",
            "rating": 4.4,
            "is_on_sale": True,
            "sizes": None,
            "discount": 43,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=8)).isoformat(),
            "stock_left": 35,
            "tags": ["lights", "decoration", "christmas"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Decorative Throw Pillow Covers",
            "description": "Set of 2 festive throw pillow covers to add holiday charm to your home.",
            "price": 499.0,
            "original_price": 799.0,
            "category": "home-decor",
            "image": "https://images.pexels.com/photos/6898854/pexels-photo-6898854.jpeg",
            "rating": 4.2,
            "is_on_sale": True,
            "sizes": None,
            "discount": 38,
            "deal_type": "clearance",
            "deal_ends": (datetime.now() + timedelta(days=6)).isoformat(),
            "stock_left": 18,
            "tags": ["pillow", "covers", "decoration"]
        }
    ]
    
    # Sample products for toys category
    toys_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Plush Teddy Bear",
            "description": "Soft and cuddly teddy bear, perfect gift for children.",
            "price": 599.0,
            "original_price": 899.0,
            "category": "toys",
            "image": "https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg",
            "rating": 4.8,
            "is_on_sale": True,
            "sizes": None,
            "discount": 33,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=9)).isoformat(),
            "stock_left": 25,
            "tags": ["teddy", "bear", "plush", "gift"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Remote Control Car",
            "description": "High-speed remote control car with long battery life.",
            "price": 899.0,
            "original_price": 1499.0,
            "category": "toys",
            "image": "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg",
            "rating": 4.5,
            "is_on_sale": True,
            "sizes": None,
            "discount": 40,
            "deal_type": "flash_sale",
            "deal_ends": (datetime.now() + timedelta(days=3)).isoformat(),
            "stock_left": 10,
            "tags": ["car", "remote", "control", "toy"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Building Blocks Set",
            "description": "Creative building blocks set to stimulate imagination.",
            "price": 699.0,
            "original_price": 999.0,
            "category": "toys",
            "image": "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg",
            "rating": 4.6,
            "is_on_sale": True,
            "sizes": None,
            "discount": 30,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=11)).isoformat(),
            "stock_left": 20,
            "tags": ["blocks", "building", "creative", "toy"]
        }
    ]
    
    # Sample products for kitchenware category
    kitchenware_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Christmas Cookie Cutters",
            "description": "Set of 12 holiday-themed cookie cutters for festive baking.",
            "price": 399.0,
            "original_price": 599.0,
            "category": "kitchenware",
            "image": "https://images.pexels.com/photos/6294402/pexels-photo-6294402.jpeg",
            "rating": 4.7,
            "is_on_sale": True,
            "sizes": None,
            "discount": 33,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=14)).isoformat(),
            "stock_left": 30,
            "tags": ["cookie", "cutters", "baking", "christmas"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Insulated Coffee Mug",
            "description": "Keep your drinks hot or cold with this double-walled insulated mug.",
            "price": 499.0,
            "original_price": 799.0,
            "category": "kitchenware",
            "image": "https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg",
            "rating": 4.4,
            "is_on_sale": True,
            "sizes": None,
            "discount": 38,
            "deal_type": "clearance",
            "deal_ends": (datetime.now() + timedelta(days=7)).isoformat(),
            "stock_left": 15,
            "tags": ["mug", "coffee", "insulated"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Silicone Baking Mat Set",
            "description": "Non-stick silicone baking mats for perfect cookies and pastries.",
            "price": 599.0,
            "original_price": 899.0,
            "category": "kitchenware",
            "image": "https://images.pexels.com/photos/6210764/pexels-photo-6210764.jpeg",
            "rating": 4.3,
            "is_on_sale": True,
            "sizes": None,
            "discount": 33,
            "deal_type": "holiday_special",
            "deal_ends": (datetime.now() + timedelta(days=10)).isoformat(),
            "stock_left": 22,
            "tags": ["baking", "mat", "silicone", "non-stick"]
        }
    ]
    
    # Combine all product lists
    all_products = clothing_products + electronics_products + home_decor_products + toys_products + kitchenware_products
    
    # Insert products into database
    for product in all_products:
        product_id = product_model.create(product)
        print(f"Created product: {product['name']} with ID: {product_id}")
    
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_database() 