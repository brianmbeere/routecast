#!/usr/bin/env python3
from app.db.database import SessionLocal
from app.models.user import User  # Import User first due to relationships
from app.models.produce import ProduceRequest

db = SessionLocal()
count = db.query(ProduceRequest).count()
db.query(ProduceRequest).delete()
db.commit()
db.close()
print(f"Deleted {count} order requests")
