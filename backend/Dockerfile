# 사용할 베이스 이미지로 Java 21을 사용
FROM openjdk:21

# 컨테이너 내에서 작업 디렉토리 설정
WORKDIR /app

# Jenkins 빌드 스크립트에서 생성된 JAR 파일을 컨테이너로 복사
COPY backend/build/libs/*.jar app.jar

EXPOSE 8081

# 애플리케이션을 실행할 커맨드 설정
ENTRYPOINT ["java", "-jar", "app.jar"]
