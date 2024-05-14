# import boto3
# import os

# def upload_file_to_s3(file_name, object_name=None):
#     # S3 서비스에 대한 클라이언트 생성
#     s3 = boto3.client('s3', aws_access_key_id=os.getenv("cloud_aws_credentials_access-key"),
#                       aws_secret_access_key=os.getenv("cloud_aws_credentials_secret-key"),
#                       region_name=os.getenv("cloud_aws_region_static"))

#     # object_name이 지정되지 않은 경우, 로컬 파일 이름을 사용
#     if object_name is None:
#         object_name = file_name

#     # 파일 업로드
#     s3.upload_file(file_name, os.getenv("cloud_aws_s3_bucket"), object_name)

#     print(f"'{file_name}' has been uploaded to '{os.getenv("cloud_aws_s3_bucket")}' as '{object_name}'")
