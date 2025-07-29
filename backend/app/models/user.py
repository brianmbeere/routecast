from sqlalchemy import Column, DateTime, Integer, String, Float, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    country = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships for produce functionality
    produce_inventory = relationship("ProduceInventory", back_populates="seller")
    restaurant_requests = relationship("ProduceRequest", foreign_keys="ProduceRequest.restaurant_id", back_populates="restaurant")
    assigned_requests = relationship("ProduceRequest", foreign_keys="ProduceRequest.assigned_seller_id", back_populates="assigned_seller")
    delivery_routes = relationship("DeliveryRoute", back_populates="seller")