from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from typing import List
import jwt
import psycopg2
import schema
import model

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dbURL = "postgresql://root:1234@postgres-server/db-database"
engine = create_engine(dbURL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/register")
def insert_register(user: schema.UserBase, session: Session = Depends(get_db)):
    db_user = model.Users(
        email = user.email,
        password = user.password,
        username = user.username,
        ohouse = int(user.ohouse)
    )

    theuser = session.query(model.Users).filter(model.Users.email == user.email).first()
    if theuser is None:
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        uuu = session.query(model.Users).filter(model.Users.email == user.email).first()
        return {"user_id": uuu.user_id}
    else:
        raise HTTPException(status_code=404, detail="Email already exists")


@app.get("/item/{itemid}")
def return_item_info(itemid: int, session: Session = Depends(get_db)):
    item = session.query(model.Items).filter(model.Items.item_id == itemid).first()
    if item is None:
        raise HTTPException(status_code=404, detail="No item in db")
    return item

@app.get("/wish/{userid}")
def return_wish_info(userid: int, session: Session = Depends(get_db)):
    wishitems = session.query(model.WishItems).filter(model.WishItems.user_id == userid).all()
    iteminfos = []
    for item in wishitems:
        theitem = session.query(model.Items).filter(model.Items.item_id == item.item_id).first()
        if theitem is None:
            raise HTTPException(status_code=404, detail="No item in db")
        iteminfos.append(theitem)

    return iteminfos

@app.get("/wishes/{userid}")
def return_wish_info(userid: int, session: Session = Depends(get_db)):
    wishitems = session.query(model.WishItems).filter(model.WishItems.user_id == userid).all()
    itemnos = []
    for item in wishitems:
        itemnos.append(item.item_id)

    return itemnos

@app.get("/wishing/{userid}/{itemid}")
def insert_wish(userid: int, itemid: int, session: Session = Depends(get_db)):
    theitem = session.query(model.WishItems).filter(model.WishItems.item_id == itemid and model.WishItems.user_id == userid)
    if theitem.first() is None:
        db_wish = model.WishItems(
            item_id = itemid,
            user_id = userid
        )
        session.add(db_wish)
        session.commit()
        session.refresh(db_wish)
        return {"response": "added"}
    else:
        return {"response": "already"}

@app.get("/unwishing/{userid}/{itemid}")
def insert_wish(userid: int, itemid: int, session: Session = Depends(get_db)):
    theitem = session.query(model.WishItems).filter(model.WishItems.item_id == itemid and model.WishItems.user_id == userid)
    if theitem.first() is None:
        return {"response": "already"}
    else:
        theitem.delete()
        session.commit()
        return {"response": "deleted"}

@app.post("/firstwish")
def insert_wish(wishbase: schema.FirstWish, session: Session = Depends(get_db)):
    return wishbasae
    for item in wishbase.itemids:
        db_wish = model.WishItems(
            item_id = item,
            user_id = wishbase.userid
        )
        session.add(db_wish)
        session.commit()
        session.refresh(db_wish)
    
    return {"response": "ok"}

@app.get("/username/{userid}")
def get_username(userid: int, session: Session = Depends(get_db)):
    theuser = session.query(model.Users).filter(model.Users.user_id == userid).first()
    return theuser.username

@app.post("/login")
def logingo(info: schema.LoginBase, session: Session = Depends(get_db)):
    theuser = session.query(model.Users).filter(model.Users.email == info.email and model.Users.password == info.password).first()

    if theuser is None:
        raise HTTPException(status_code=404, detail="No user in db")
    else:
        return theuser.user_id