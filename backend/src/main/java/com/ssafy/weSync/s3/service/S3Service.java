package com.ssafy.weSync.s3.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j // log
public class S3Service {

    // Spring Boot Cloud AWS를 사용하게 되면 S3 관련 Bean을 자동 생성
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // MultipartFile을 전달받아 File로 전환한 후 S3에 업로드
    // dirName : teamImage / record
    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        File uploadFile = convert(multipartFile)
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 전환 실패"));
        return upload(uploadFile, dirName);
    }

    // 고유 파일명 생성
    public String upload(File uploadFile, String dirName) {
        String uuid = UUID.nameUUIDFromBytes(uploadFile.getName().getBytes()).toString();
        String formatDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern(" yyyy-MM-dd HH:mm:ss"));
        String fileName = dirName + "/" + uuid + formatDate + ".jpg";
        String uploadImageUrl = putS3(uploadFile, fileName);
        removeNewFile(uploadFile);
        return uploadImageUrl;
    }

    // 파일 업로드 후 S3 URL 주소 반환
    public String putS3(File uploadFile, String fileName) {
        amazonS3Client.putObject(
                new PutObjectRequest(bucket, fileName, uploadFile)
                        .withCannedAcl(CannedAccessControlList.PublicRead)	// PublicRead 권한으로 업로드
        );
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    // 로컬에 생성된 File 삭제 (MultipartFile -> File 전환 하며 로컬에 파일 생성)
    public void removeNewFile(File targetFile) {
        if(targetFile.delete()) {
            log.info("파일이 삭제되었습니다.");
        }else {
            log.info("파일이 삭제되지 못했습니다.");
        }
    }

    // MultipartFile -> File
    public Optional<File> convert(MultipartFile file) throws IOException {
        File convertFile = new File(file.getOriginalFilename());
        if(convertFile.createNewFile()) { // 빈 파일 생성 -> 같은 이름을 가진 파일이 없으면 true
            try (FileOutputStream fos = new FileOutputStream(convertFile)) { // convertFile : 파일이 쓰여질 경로
                fos.write(file.getBytes()); // 바이트 데이터 추출하여 쓰기
                fos.close();
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }

    // s3에 업로드된 파일 삭제
    public void deleteS3Object(String Key) { // 객체 키
        amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, Key));
        log.info("{} 파일이 삭제되었습니다.", Key);
    }

}
