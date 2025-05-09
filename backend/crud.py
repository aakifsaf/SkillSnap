from sqlalchemy.orm import Session
from . import models, schemas

# User CRUD operations

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_github_id(db: Session, github_id: str):
    return db.query(models.User).filter(models.User.github_id == github_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        github_id=user.github_id,
        username=user.username,
        email=user.email,
        avatar_url=user.avatar_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# We can add update and delete functions later as needed
# def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
#     db_user = get_user(db, user_id)
#     if db_user:
#         update_data = user_update.dict(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(db_user, key, value)
#         db.commit()
#         db.refresh(db_user)
#     return db_user

# def delete_user(db: Session, user_id: int):
#     db_user = get_user(db, user_id)
#     if db_user:
#         db.delete(db_user)
#         db.commit()
#     return db_user
