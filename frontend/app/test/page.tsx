'use client';

import Image from 'next/image';
import AlertTest from '@/components/home/alertTest';
import CssTest from '@/components/home/cssTest';
import { ChangeEvent, useState, useEffect } from 'react';

export default function TestComponent() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const [dots, setDots] = useState('');

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

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading flex-col justify-center items-center">
      <input id="swal-input3" onChange={handleImageChange} type="file" accept="image/*"/>
      {/* {images && (
        // <p>input3: {images[0].url}</p>
      )} */}
      <div>
        <Image
          src={'/loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          style={{ margin: 'auto' }}
        ></Image>
        <h2 className="text-center mt-10">싱크 맞추는 중{dots}</h2>
      </div>
      <AlertTest />
      <CssTest />
    </div>
  );
}
