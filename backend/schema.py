from pydantic import BaseModel
from typing import List

class UserBase(BaseModel):
    email: str
    password: str
    username: str
    ohouse: str

class LoginBase(BaseModel):
    email: str
    password: str

class WishBase(BaseModel):
    itemid: int
    userid: int

class FirstWish(BaseModel):
    userid: int
    itemids: List[int]