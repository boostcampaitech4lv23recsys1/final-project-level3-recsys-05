from pydantic import BaseModel

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