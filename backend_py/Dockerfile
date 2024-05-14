FROM python:3.7

WORKDIR /wesync

COPY requirements.txt /wesync/requirements.txt

# 기존에 있던 RUN 명령어들
RUN apt-get update && apt-get install -y \
    wget \
    software-properties-common \
    libgl1-mesa-glx \
    libfuse2 \
    libjack-jackd2-dev \
    libasound2 \
    libnss3-dev \
    libxcb-xinerama0 \
    libegl1-mesa

# xvfb와 X11 관련 패키지들을 설치합니다.
RUN apt-get update

RUN apt-get install -y xvfb

# MuseScore 설치
RUN wget https://github.com/musescore/MuseScore/releases/download/v3.4.1/MuseScore-3.4.1-x86_64.AppImage -O /usr/bin/musescore.appimage && \
    chmod +x /usr/bin/musescore.appimage

RUN pip install --no-cache-dir --upgrade -r /wesync/requirements.txt

COPY ./app/ /wesync/app/
COPY ./scoreRecognition/ /wesync/scoreRecognition/

# xvfb를 시작하는 스크립트를 추가합니다.
RUN echo 'Xvfb :99 -screen 0 1024x768x24 -ac &' > /start-xvfb.sh && chmod +x /start-xvfb.sh

# DISPLAY 환경 변수 설정
ENV DISPLAY=:99

# xvfb를 시작하고 원래의 CMD 명령어를 실행합니다.
CMD /start-xvfb.sh && uvicorn app.main:app --host 0.0.0.0 --port 8080
