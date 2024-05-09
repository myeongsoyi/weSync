'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';
import Image from 'next/image';

declare global {
  interface Window {
    Kakao: any;
  }
}

// interface btnProps {
//   children: String;
// }

export default function KakaoLoginBtn() {
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

  const router = useRouter();

  useEffect(() => {
    const kakaoSDK = document.createElement('script');
    kakaoSDK.async = false;
    kakaoSDK.src = `https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js`;
    kakaoSDK.integrity = `sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG0bjM55XohjjDT7tDDC01`;
    kakaoSDK.crossOrigin = 'anonymous';
    document.head.appendChild(kakaoSDK);
    
    const onLoadKakaoAPI = () => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
    };

    kakaoSDK.addEventListener('load', onLoadKakaoAPI);
  }, []);

  return (
    <button
      className={`${styles.kakao}`}
      onClick={() => router.push(`${KAKAO_AUTH_URI}`)}
    >
      <Image
        src={'/svgs/kakao.png'}
        alt="카톡로그인"
        width={150}
        height={100}
      />
    </button>
  );
}
