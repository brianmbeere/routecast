# Database migration for produce management features
# Run this to add the new tables to your database

from app.db.database import engine, Base
from app.models.user import User
from app.models.produce import ProduceInventory, ProduceRequest, DeliveryRoute, DeliveryStop

def create_tables():
    """Create all new tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")

def add_sample_data():
    """Add some sample data for testing"""
    from sqlalchemy.orm import sessionmaker
    from datetime import datetime, timedelta
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Add sample produce inventory
        sample_inventory = ProduceInventory(
            seller_id=1,  # Assuming user ID 1 exists
            produce_type="Tomatoes",
            variety="Heirloom",
            quantity_available=100.0,
            unit="kg",
            price_per_unit=5.50,
            location="Grand Rapids, MI",
            latitude=42.9634,
            longitude=-85.6681,
            organic=True,
            description="Fresh heirloom tomatoes from local farm"
        )
        
        db.add(sample_inventory)
        
        # Add sample produce request
        sample_request = ProduceRequest(
            restaurant_id=2,  # Assuming user ID 2 exists
            restaurant_name="The Green Well",
            produce_type="Tomatoes",
            quantity_needed=20.0,
            unit="kg",
            max_price_per_unit=6.00,
            delivery_address="924 Cherry Street Southeast, Grand Rapids, Michigan 49506, United States",
            delivery_latitude=42.9561,
            delivery_longitude=-85.6366,
            delivery_window_start=datetime.now() + timedelta(hours=2),
            delivery_window_end=datetime.now() + timedelta(hours=4),
            special_requirements="Organic tomatoes preferred"
        )
        
        db.add(sample_request)
        db.commit()
        print("✅ Sample data added successfully!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Starting database migration...")
    create_tables()
    
    # Uncomment to add sample data
    # add_sample_data()
    
    print("✅ Migration completed!")
