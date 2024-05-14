FROM python:3.7

WORKDIR /wesync

COPY requirements.txt /wesync/requirements.txt

RUN apt-get update && apt-get install -y \
    wget \
    software-properties-common

RUN apt-get -y install libgl1-mesa-glx

RUN wget https://github.com/musescore/MuseScore/releases/download/v4.3.0/MuseScore-Studio-4.3.0.241231431-x86_64.AppImage -O /usr/bin/musescore.appimage && \
    chmod +x /usr/bin/musescore.appimage


RUN pip install --no-cache-dir --upgrade -r /wesync/requirements.txt

RUN apt-get install -y fuse
RUN apt-get update && apt-get install -y fuse
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/path/to/libfuse.so.2

COPY ./app/ /wesync/app/
COPY ./scoreRecognition/ /wesync/scoreRecognition/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

