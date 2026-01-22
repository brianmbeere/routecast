#!/usr/bin/env python3
from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text('ALTER TABLE produce_requests ALTER COLUMN restaurant_id DROP NOT NULL'))
    conn.commit()
    print('Successfully made restaurant_id nullable')
