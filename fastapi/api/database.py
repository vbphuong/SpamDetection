from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQL_ALCHEMY_DATABASE_URL = 'postgresql://postgres.abngeiexhxbigorjgeym:binhphuong2035@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres'


engine = create_engine(SQL_ALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit = False, autoflush=False, bind=engine)

Base = declarative_base()