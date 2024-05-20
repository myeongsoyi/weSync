'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import RecordAudioPlayer from '@/components/common/RecordAudioPlayer';

export default function TestComponent() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading flex-col justify-center items-center">
      <div>
        <Image
          src={'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/Loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          style={{ margin: 'auto' }}
          unoptimized
          priority
        ></Image>
        <h2 className="text-center mt-10">싱크 맞추는 중{dots}</h2>
      </div>
      <RecordAudioPlayer />
    </div>
  );
}
