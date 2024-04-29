FROM openjdk:21

# 작업 디렉토리를 설정
WORKDIR /app

# 호스트의 빌드 파일을 Docker 이미지 내로 복사
COPY build/libs/weSync-0.0.1-SNAPSHOT.jar app.jar

# JAR 파일을 실행하는 명령을 설정
ENTRYPOINT ["java", "-jar", "app.jar"]
