FROM python:3.7

WORKDIR /wesync

COPY requirements.txt /wesync/requirements.txt

RUN apt-get update

RUN pip install --no-cache-dir --upgrade -r /wesync/requirements.txt

COPY ./app/ /wesync/app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

