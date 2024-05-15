import boto3
import os

def upload_file_to_s3(file_name, object_name=None):
    s3 = boto3.client('s3', aws_access_key_id=os.getenv("cloud_aws_credentials_access-key"),
                      aws_secret_access_key=os.getenv("cloud_aws_credentials_secret-key"),
                      region_name=os.getenv("cloud_aws_region_static"))
    
    print("*", os.getenv("cloud_aws_credentials_access-key"))
    print("**", os.getenv("cloud_aws_credentials_secret-key"))
    print("***", os.getenv("cloud_aws_region_static"))

    if object_name is None:
        object_name = file_name

    s3.upload_file(file_name, os.getenv("cloud_aws_s3_bucket"), object_name)
    print("****", os.getenv("cloud_aws_s3_bucket"))

    print(f"'{file_name}' has been uploaded to '{os.getenv('cloud_aws_s3_bucket')}' as '{object_name}'")
