FROM python:3.7

WORKDIR /wesync

COPY requirements.txt /wesync/requirements.txt

RUN apt-get update && apt-get install -y \
    wget \
    software-properties-common

RUN apt-get -y install libgl1-mesa-glx

RUN curl https://musescore.org/en/download/musescore-x86_64.AppImage -O /wesync/musescore.appimage && \
    chmod +x /wesync/musescore.appimage


RUN pip install --no-cache-dir --upgrade -r /wesync/requirements.txt

COPY ./app/ /wesync/app/
COPY ./scoreRecognition/ /wesync/scoreRecognition/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

