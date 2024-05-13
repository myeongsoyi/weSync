# 1. Node.js 이미지를 기반으로 설정
FROM node:20.10.0

# 2. 앱 디렉토리 생성
WORKDIR /usr/src/app

# 3. 애플리케이션 의존성 파일 복사
# package.json 및 package-lock.json (또는 yarn.lock) 포함
COPY package.json yarn.lock  ./

# 4. 애플리케이션 의존성 설치
RUN yarn install --frozen-lockfile

# 5. 애플리케이션 소스 복사
COPY . .
COPY .next/static .next/standalone/.next/static

# 6. Next.js 애플리케이션 빌드
RUN yarn build

# 7. 애플리케이션 실행
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
