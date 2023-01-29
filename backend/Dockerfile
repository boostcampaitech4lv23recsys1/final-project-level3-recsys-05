FROM python:3.9

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

RUN pip install -U pip &&\
    pip install scikit-learn pandas psycopg2-binary\
    pip install fastapi\
    pip install uvicorn\
    pip install pydantic\
    pip install sqlalchemy

COPY server.py server.py
COPY schema.py schema.py
COPY model.py model.py


ENTRYPOINT ["uvicorn", "server:app", "--host", "0.0.0.0"]