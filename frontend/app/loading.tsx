'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading flex-col justify-center items-center">
      <div>
        <Image
          src={'/loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          style={{ margin: 'auto', height: 'auto' }}
        ></Image>
        <h2 className="text-center mt-10">싱크 맞추는 중{dots}</h2>
      </div>
    </div>
  );
}
