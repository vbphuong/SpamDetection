from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from models import User
from deps import db_dependency, bcrypt_context, admin_dependency

load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

class UserCreateRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str 
    token_type: str

def authenticate_user(email: str, password: str, db):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password_hash):
        return False
    return user

def create_access_token(email: str, user_id: int, role: str, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id, 'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):

    existing_user = db.query(User).filter(User.email == create_user_request.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email has been registered, please choose another email"
        )
    
    create_user_model = User(
        email = create_user_request.email,
        password_hash = bcrypt_context.hash(create_user_request.password)
    )
    db.add(create_user_model)
    db.commit()

@router.post('/token', response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
    token = create_access_token(
        user.email, 
        user.user_id, 
        user.role,
        timedelta(minutes=30))

    return {'access_token' : token, 'token_type' : 'bearer'}

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: db_dependency, admin: admin_dependency):
    user = db.query(User).filter(User.user_id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(user)
    db.commit()