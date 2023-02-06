import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Text, Integer, Boolean, Float, Sequence

Base = declarative_base()

class Items(Base):
    __tablename__ = "item_data"

    item_id = Column(Integer, primary_key=True, index=True)
    title = Column(Text)
    brand = Column(Text)    
    og_price = Column(Integer)
    selling_price = Column(Integer)
    delivery_fee = Column(Integer)
    delivery_fee_threshold = Column(Integer)
    wish_count = Column(Integer)
    review_avg = Column(Float)
    is_sold_out = Column(Boolean)
    category0 = Column(Text)
    category1 = Column(Text)
    image_url = Column(Text)

class Users(Base):
    __tablename__ = "user_data"
    
    user_id = Column(Integer, Sequence('seq_user'), primary_key=True)
    email = Column(Text)
    password = Column(Text)
    username = Column(Text)
    ohouse = Column(Integer)

class WishItems(Base):
    __tablename__ = "wish_data"

    wish_id = Column(Integer, Sequence('seq_wish'), primary_key=True)
    user_id = Column(Integer)
    item_id = Column(Integer)
    