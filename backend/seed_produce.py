#!/usr/bin/env python3
from app.db.database import SessionLocal
from app.models.user import User
from app.models.produce import ProduceInventory

db = SessionLocal()

# Get a farmer user (or first user if no farmer)
farmer = db.query(User).filter(User.role == 'farmer').first()
if not farmer:
    farmer = db.query(User).first()

if not farmer:
    print('No user found in database. Please create a user first.')
else:
    print(f'Using seller: {farmer.full_name} (ID: {farmer.id})')
    
    produce_items = [
        {
            'seller_id': farmer.id,
            'produce_type': 'Tomatoes',
            'variety': 'Roma',
            'quantity_available': 500,
            'unit': 'kg',
            'price_per_unit': 2.50,
            'location': 'Kiambu Farm, Kiambu County',
            'latitude': -1.1714,
            'longitude': 36.8356,
            'organic': True,
            'description': 'Fresh organic Roma tomatoes, perfect for sauces and salads'
        },
        {
            'seller_id': farmer.id,
            'produce_type': 'Spinach',
            'variety': 'Baby Spinach',
            'quantity_available': 200,
            'unit': 'kg',
            'price_per_unit': 3.00,
            'location': 'Limuru Greenhouses, Kiambu',
            'latitude': -1.1063,
            'longitude': 36.6413,
            'organic': True,
            'description': 'Tender baby spinach leaves, freshly harvested'
        },
        {
            'seller_id': farmer.id,
            'produce_type': 'Potatoes',
            'variety': 'Shangi',
            'quantity_available': 1000,
            'unit': 'kg',
            'price_per_unit': 1.20,
            'location': 'Nyandarua Farms, Nyandarua County',
            'latitude': -0.1833,
            'longitude': 36.5167,
            'organic': False,
            'description': 'Premium Shangi potatoes, great for chips and mashing'
        },
        {
            'seller_id': farmer.id,
            'produce_type': 'Avocados',
            'variety': 'Hass',
            'quantity_available': 300,
            'unit': 'kg',
            'price_per_unit': 4.50,
            'location': 'Muranga Orchards, Muranga County',
            'latitude': -0.7833,
            'longitude': 37.1500,
            'organic': True,
            'description': 'Creamy Hass avocados, perfect ripeness for guacamole'
        },
        {
            'seller_id': farmer.id,
            'produce_type': 'Green Beans',
            'variety': 'French Beans',
            'quantity_available': 150,
            'unit': 'kg',
            'price_per_unit': 2.80,
            'location': 'Naivasha Export Farm, Nakuru County',
            'latitude': -0.7167,
            'longitude': 36.4333,
            'organic': False,
            'description': 'Export-quality French beans, crisp and tender'
        }
    ]
    
    for item in produce_items:
        produce = ProduceInventory(**item)
        db.add(produce)
    
    db.commit()
    print(f'Added {len(produce_items)} produce items to the database')

db.close()
