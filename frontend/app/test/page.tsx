'use client'

import Image from 'next/image';
import AlertTest from '@/components/home/alertTest';
import CssTest from '@/components/home/cssTest';
import { ChangeEvent, useState } from 'react';

export default function TestComponent() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedImages = Array.from(event.target.files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file, // 파일 자체를 저장
      }));
      console.log(uploadedImages);
      setImages([...images, ...uploadedImages]);
    }
  };
  
  return (
    <div className="loading flex-col justify-center items-center">
      <input id="swal-input3" onChange={handleImageChange} type="file" accept="image/*"/>
      {/* {images && (
        // <p>input3: {images[0].url}</p>
      )} */}
      <div>
        <Image
          src={'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/Loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          style={{ margin: 'auto' }}
          priority
        ></Image>
        <h2 className="text-center mt-10">잠시만</h2>
        <h2 className="text-center">기다려주세요</h2>
      </div>
      <AlertTest />
      <CssTest />
    </div>
  );
}
