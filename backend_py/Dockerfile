FROM python:3.7

WORKDIR /wesync

RUN apt-get update && apt-get install -y \
    timidity \
    lilypond \
    python-ly \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /wesync/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /wesync/requirements.txt

COPY ./app/ /wesync/app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]