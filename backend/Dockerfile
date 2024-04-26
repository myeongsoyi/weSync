# Java 21을 베이스 이미지로 사용
FROM openjdk:21

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# Gradle Wrapper를 실행하기 위해 필요한 파일들을 컨테이너에 복사
COPY backend/gradle/wrapper/gradle-wrapper.jar /app/gradle/wrapper/
COPY backend/gradlew /app/
COPY backend/gradle.properties /app/
COPY backend/build.gradle /app/
COPY backend/settings.gradle /app/
COPY backend/src /app/src

# 환경 변수 설정 (필요에 따라 추가)
ENV GRADLE_USER_HOME=/app/gradle

# Gradle Wrapper를 사용하여 프로젝트 빌드
RUN ./gradlew clean build

# 빌드된 JAR 파일을 컨테이너로 복사
COPY backend/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]