from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
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
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


# @app.post("/register")
# def insert_register(user: schema.User):
#     insert_register_query = f"""
#     INSERT INTO user_data
#     (email, password, username, ohouse)
#     VALUES (
#         '{user.email}',
#         '{user.password}',
#         '{user.username}',
#         {int(user.ohouse)}
#     );
#     """

#     with db_connect.cursor() as cur:
#         cur.execute(insert_register_query)
#         db_connect.commit()

#     return {"insertion": "ok"}

@app.get("/item/{itemid}")
def return_item_info(itemid: int, session: Session = Depends(get_db)):
    item = session.query(model.Items).filter(model.Items.item_id == itemid).first()
    if item is None:
        raise HTTPException(status_cod=404, detail="No item in db")
    return item

@app.get("/wish/{userid}")
def return_wish_info(userid: int, session: Session = Depends(get_db)):
    wishitems = session.query(model.WishItems).filter(model.WishItems.user_id == userid).all()
    iteminfos = []
    for item in wishitems:
        theitem = session.query(model.Items).filter(model.Items.item_id == item.item_id).first()
        if theitem is None:
            raise HTTPException(status_cod=404, detail="No item in db")
        iteminfos.append(theitem)

    return iteminfos

@app.post()

@app.post("/wish")
def insert_wish(wishitem: int, session: Session = Depends(get_db)):
    db_user = model.Users(
        email = user.email,
        password = user.password,
        username = user.username,
        ohouse = int(user.ohouse)
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user