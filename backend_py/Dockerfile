FROM python:3.7

WORKDIR /wesync

RUN apt-get update && apt-get install -y \
    timidity \
    python-ly \
    && rm -rf /var/lib/apt/lists/*

# LilyPond 설치
RUN wget http://download.linuxaudio.org/lilypond/binaries/linux-64/lilypond-2.14.0-1.linux-64.sh \
    && sh lilypond-2.14.0-1.linux-64.sh --batch \
    && rm lilypond-2.14.0-1.linux-64.sh

COPY requirements.txt /wesync/requirements.txt
COPY .env /wesync/.env

RUN pip install --no-cache-dir --upgrade -r /wesync/requirements.txt

COPY ./app/ /wesync/app/
COPY ./scoreRecognition/ /wesync/scoreRecognition/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]