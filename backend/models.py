from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func # For server-side default timestamp
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(String, unique=True, index=True, nullable=False) # GitHub's unique ID for the user
    username = Column(String, unique=True, index=True, nullable=False) # GitHub username
    email = Column(String, unique=True, index=True, nullable=True) # GitHub email (can be null)
    avatar_url = Column(String, nullable=True)
    # access_token = Column(String, nullable=False) # We might store this securely elsewhere or handle it differently
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Add relationships later, e.g., to projects
    # projects = relationship("Project", back_populates="owner")
