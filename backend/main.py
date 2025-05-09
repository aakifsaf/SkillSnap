from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import SessionLocal, engine, get_db

# Create all tables in the database (for development only, use Alembic for production)
# This needs to be called before the app starts if models are defined
# However, for a more robust setup, you might run this separately or use Alembic.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillSnap API",
    description="API for SkillSnap - Resume Builder from GitHub & Course Projects",
    version="0.1.0"
)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to SkillSnap API"}

# We will add more endpoints here, for example, for user operations:
# @app.post("/users/", response_model=schemas.User, tags=["Users"])
# def create_user_endpoint(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_github_id(db, github_id=user.github_id)
#     if db_user:
#         raise HTTPException(status_code=400, detail="User with this GitHub ID already registered")
#     return crud.create_user(db=db, user=user)

# Placeholder for GitHub OAuth routes to be added later
# from .routers import github_auth # Example, will create later
# app.include_router(github_auth.router)

print("SkillSnap API starting...")
