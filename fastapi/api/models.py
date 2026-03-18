from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    scans = relationship("ScanRequest", back_populates="user")


class ScanRequest(Base):
    __tablename__ = "scan_requests"

    scan_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)

    scan_type = Column(String)        # text / url / file
    input_content = Column(String)    # message, url, or filename
    result = Column(String)           # benign / spam / malware
    confidence = Column(Float)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="scans")