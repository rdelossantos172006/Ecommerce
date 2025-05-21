import sqlite3
import json
import os
import hashlib
import secrets
from datetime import datetime

class Database:
    def __init__(self, db_name="rubyshop.db"):
        self.db_name = db_name
        self.conn = None
        self.cursor = None
        self.connect()
        self.create_tables()
    
    def connect(self):
        """Establish a connection to the database"""
        try:
            db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), self.db_name)
            self.conn = sqlite3.connect(db_path, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row  # Return rows as dictionaries
            self.cursor = self.conn.cursor()
            return True
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            return False
    
    def close(self):
        """Close the database connection"""
        if self.conn:
            self.conn.close()
    
    def execute_query(self, query, params=None):
        """Execute a query with its own cursor to avoid recursion issues"""
        cursor = self.conn.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            return cursor
        except sqlite3.Error as e:
            print(f"Query execution error: {e}")
            cursor.close()
            raise
    
    def create_tables(self):
        """Create all required tables if they don't exist"""
        # Users table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Products table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                original_price REAL,
                category TEXT NOT NULL,
                image TEXT,
                rating REAL DEFAULT 0,
                is_on_sale BOOLEAN DEFAULT 0,
                sizes TEXT,
                discount REAL DEFAULT 0,
                deal_type TEXT,
                deal_ends TEXT,
                stock_left INTEGER DEFAULT 100,
                tags TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Orders table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total_amount REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                shipping_address TEXT,
                payment_method TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Order items table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                size TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')
        
        # Reviews table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Wishlist table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS wishlist_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')
        
        self.conn.commit()


class User:
    def __init__(self, db):
        self.db = db
    
    def create(self, email, password, name=None):
        """Create a new user"""
        try:
            password_hash = self._hash_password(password)
            self.db.cursor.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
                (email, password_hash, name)
            )
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except sqlite3.IntegrityError:
            return None  # Email already exists
    
    def authenticate(self, email, password):
        """Authenticate a user by email and password"""
        # Validate email format
        if not email or '@' not in email or '.' not in email.split('@')[1]:
            return None  # Invalid email format
            
        # Check if email exists in database
        self.db.cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = self.db.cursor.fetchone()
        
        # Only validate password if user exists
        if user and self._verify_password(password, user['password_hash']):
            return dict(user)  # Convert sqlite3.Row to dict
        return None
    
    def get_by_id(self, user_id):
        """Get user by ID"""
        self.db.cursor.execute("SELECT id, email, name, created_at FROM users WHERE id = ?", (user_id,))
        user = self.db.cursor.fetchone()
        return dict(user) if user else None
    
    def update(self, user_id, name=None, email=None):
        """Update user information"""
        update_fields = []
        params = []
        
        if name:
            update_fields.append("name = ?")
            params.append(name)
        
        if email:
            update_fields.append("email = ?")
            params.append(email)
        
        if not update_fields:
            return False
        
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        
        query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
        params.append(user_id)
        
        self.db.cursor.execute(query, params)
        self.db.conn.commit()
        return self.db.cursor.rowcount > 0
    
    def _hash_password(self, password):
        """Hash a password using salt"""
        salt = secrets.token_hex(8)
        h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}${h.hex()}"
    
    def _verify_password(self, password, stored_hash):
        """Verify a password against its stored hash"""
        salt, hash_val = stored_hash.split('$')
        h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return h.hex() == hash_val


class Product:
    def __init__(self, db):
        self.db = db
    
    def create(self, product_data):
        """Create a new product"""
        fields = [
            'id', 'name', 'description', 'price', 'original_price', 'category', 
            'image', 'rating', 'is_on_sale', 'sizes', 'discount', 'deal_type', 
            'deal_ends', 'stock_left', 'tags'
        ]
        
        values = []
        placeholders = []
        
        for field in fields:
            if field in product_data:
                value = product_data[field]
                
                # Serialize lists to JSON strings
                if field in ['sizes', 'tags'] and isinstance(value, list):
                    value = json.dumps(value)
                
                values.append(value)
                placeholders.append('?')
            else:
                values.append(None)
                placeholders.append('?')
        
        query = f"INSERT INTO products ({', '.join(fields)}) VALUES ({', '.join(placeholders)})"
        self.db.cursor.execute(query, values)
        self.db.conn.commit()
        return product_data['id']
    
    def get_by_id(self, product_id):
        """Get product by ID"""
        query = "SELECT * FROM products WHERE id = ?"
        try:
            cursor = self.db.execute_query(query, (product_id,))
            product = cursor.fetchone()
            cursor.close()
            if product:
                return self._format_product(dict(product))
            return None
        except sqlite3.Error as e:
            print(f"Error fetching product by ID: {e}")
            return None
    
    def get_all(self, limit=None, offset=None):
        """Get all products with optional pagination"""
        query = "SELECT * FROM products"
        params = []
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
            
            if offset:
                query += " OFFSET ?"
                params.append(offset)
        
        try:
            cursor = self.db.execute_query(query, params)
            products = cursor.fetchall()
            cursor.close()
            return [self._format_product(dict(p)) for p in products]
        except sqlite3.Error as e:
            print(f"Error fetching all products: {e}")
            return []
    
    def get_by_category(self, category, limit=None):
        """Get products by category"""
        query = "SELECT * FROM products WHERE category = ?"
        params = [category]
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
        
        try:
            cursor = self.db.execute_query(query, params)
            products = cursor.fetchall()
            cursor.close()
            return [self._format_product(dict(p)) for p in products]
        except sqlite3.Error as e:
            print(f"Error fetching products by category: {e}")
            return []
    
    def get_on_sale(self, limit=None):
        """Get products that are on sale"""
        query = "SELECT * FROM products WHERE is_on_sale = 1"
        params = []
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
        
        try:
            cursor = self.db.execute_query(query, params)
            products = cursor.fetchall()
            cursor.close()
            return [self._format_product(dict(p)) for p in products]
        except sqlite3.Error as e:
            print(f"Error fetching on sale products: {e}")
            return []
    
    def search(self, query, limit=None):
        """Search products by name or description"""
        search_term = f"%{query}%"
        sql_query = """
            SELECT * FROM products 
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        """
        params = [search_term, search_term, search_term]
        
        if limit:
            sql_query += " LIMIT ?"
            params.append(limit)
        
        try:
            cursor = self.db.execute_query(sql_query, params)
            products = cursor.fetchall()
            cursor.close()
            return [self._format_product(dict(p)) for p in products]
        except sqlite3.Error as e:
            print(f"Error searching products: {e}")
            return []
    
    def update(self, product_id, product_data):
        """Update product information"""
        update_fields = []
        params = []
        
        for field, value in product_data.items():
            if field in ['sizes', 'tags'] and isinstance(value, list):
                value = json.dumps(value)
            
            update_fields.append(f"{field} = ?")
            params.append(value)
        
        if not update_fields:
            return False
        
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        
        query = f"UPDATE products SET {', '.join(update_fields)} WHERE id = ?"
        params.append(product_id)
        
        self.db.cursor.execute(query, params)
        self.db.conn.commit()
        return self.db.cursor.rowcount > 0
    
    def _format_product(self, product):
        """Format product data before returning"""
        # Convert JSON strings to lists
        if product.get('sizes') and isinstance(product['sizes'], str):
            try:
                product['sizes'] = json.loads(product['sizes'])
            except:
                product['sizes'] = []
        
        if product.get('tags') and isinstance(product['tags'], str):
            try:
                product['tags'] = json.loads(product['tags'])
            except:
                product['tags'] = []
        
        # Convert integer boolean to Python boolean
        product['is_on_sale'] = bool(product['is_on_sale'])
        
        return product


class Order:
    def __init__(self, db):
        self.db = db
    
    def create(self, user_id, items, total_amount, shipping_address=None, payment_method=None):
        """Create a new order with items"""
        try:
            self.db.cursor.execute(
                """INSERT INTO orders 
                   (user_id, total_amount, shipping_address, payment_method) 
                   VALUES (?, ?, ?, ?)""",
                (user_id, total_amount, shipping_address, payment_method)
            )
            order_id = self.db.cursor.lastrowid
            
            # Add order items
            for item in items:
                self.db.cursor.execute(
                    """INSERT INTO order_items 
                       (order_id, product_id, quantity, price, size) 
                       VALUES (?, ?, ?, ?, ?)""",
                    (order_id, item['product_id'], item['quantity'], 
                     item['price'], item.get('size'))
                )
            
            self.db.conn.commit()
            return order_id
        except sqlite3.Error as e:
            self.db.conn.rollback()
            print(f"Error creating order: {e}")
            return None
    
    def get_by_id(self, order_id, user_id=None):
        """Get order by ID with optional user ID check"""
        query = """
            SELECT o.*, json_group_array(
                json_object(
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'size', oi.size,
                    'name', p.name,
                    'image', p.image
                )
            ) as items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = ?
        """
        params = [order_id]
        
        if user_id:
            query += " AND o.user_id = ?"
            params.append(user_id)
        
        query += " GROUP BY o.id"
        
        self.db.cursor.execute(query, params)
        order = self.db.cursor.fetchone()
        
        if order:
            order_dict = dict(order)
            try:
                order_dict['items'] = json.loads(order_dict['items'])
            except:
                order_dict['items'] = []
            return order_dict
        return None
    
    def get_user_orders(self, user_id):
        """Get all orders for a user"""
        self.db.cursor.execute(
            """SELECT id, total_amount, status, created_at 
               FROM orders WHERE user_id = ? 
               ORDER BY created_at DESC""",
            (user_id,)
        )
        orders = self.db.cursor.fetchall()
        return [dict(order) for order in orders]
    
    def update_status(self, order_id, status):
        """Update order status"""
        self.db.cursor.execute(
            """UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?""",
            (status, order_id)
        )
        self.db.conn.commit()
        return self.db.cursor.rowcount > 0


class Review:
    def __init__(self, db):
        self.db = db
    
    def create(self, product_id, user_id, rating, comment=None):
        """Create a product review"""
        try:
            self.db.cursor.execute(
                """INSERT INTO reviews 
                   (product_id, user_id, rating, comment) 
                   VALUES (?, ?, ?, ?)""",
                (product_id, user_id, rating, comment)
            )
            self.db.conn.commit()
            
            # Update product rating
            self._update_product_rating(product_id)
            
            return self.db.cursor.lastrowid
        except sqlite3.Error as e:
            print(f"Error creating review: {e}")
            return None
    
    def get_by_product(self, product_id):
        """Get all reviews for a product"""
        self.db.cursor.execute(
            """SELECT r.*, u.name as user_name
               FROM reviews r
               JOIN users u ON r.user_id = u.id
               WHERE r.product_id = ?
               ORDER BY r.created_at DESC""",
            (product_id,)
        )
        reviews = self.db.cursor.fetchall()
        return [dict(review) for review in reviews]
    
    def _update_product_rating(self, product_id):
        """Update product average rating"""
        self.db.cursor.execute(
            """SELECT AVG(rating) as avg_rating
               FROM reviews
               WHERE product_id = ?""",
            (product_id,)
        )
        result = self.db.cursor.fetchone()
        
        if result and result['avg_rating']:
            self.db.cursor.execute(
                """UPDATE products
                   SET rating = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (result['avg_rating'], product_id)
            )
            self.db.conn.commit()


class Wishlist:
    def __init__(self, db):
        self.db = db
    
    def add_item(self, user_id, product_id):
        """Add product to user's wishlist"""
        try:
            self.db.cursor.execute(
                """INSERT INTO wishlist_items 
                   (user_id, product_id)
                   VALUES (?, ?)""",
                (user_id, product_id)
            )
            self.db.conn.commit()
            return True
        except sqlite3.IntegrityError:
            # Item already in wishlist
            return False
    
    def remove_item(self, user_id, product_id):
        """Remove product from user's wishlist"""
        self.db.cursor.execute(
                """DELETE FROM wishlist_items
                   WHERE user_id = ? AND product_id = ?""",
                (user_id, product_id)
            )
        self.db.conn.commit()
        return self.db.cursor.rowcount > 0
    
    def get_user_wishlist(self, user_id):
        """Get all products in user's wishlist"""
        self.db.cursor.execute(
            """SELECT p.*, w.created_at as added_at
               FROM wishlist_items w
               JOIN products p ON w.product_id = p.id
               WHERE w.user_id = ?
               ORDER BY w.created_at DESC""",
            (user_id,)
        )
        products = self.db.cursor.fetchall()
        
        formatted_products = []
        for product in products:
            product_dict = dict(product)
            
            # Format lists
            if product_dict.get('sizes') and isinstance(product_dict['sizes'], str):
                try:
                    product_dict['sizes'] = json.loads(product_dict['sizes'])
                except:
                    product_dict['sizes'] = []
            
            if product_dict.get('tags') and isinstance(product_dict['tags'], str):
                try:
                    product_dict['tags'] = json.loads(product_dict['tags'])
                except:
                    product_dict['tags'] = []
            
            # Convert integer boolean to Python boolean
            product_dict['is_on_sale'] = bool(product_dict['is_on_sale'])
            
            formatted_products.append(product_dict)
        
        return formatted_products 